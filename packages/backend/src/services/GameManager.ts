import { GameModel } from '@/models/GameModel';
import { GameActionRequestModel } from '@/schemas/GameActionRequestSchema';
import { botService } from '@/services/BotService';
import { logger } from '@/server';
import { SocketServerType } from '@/types';
import invariant from 'tiny-invariant';

export class GameManager {
  /**
   * Handles post-action processing and triggers bot moves if necessary
   */
  public async handlePostGameAction(game: GameModel, io: SocketServerType): Promise<void> {
    if (!game.isAgainstBot || !game.state) {
      return;
    }

    const gameState = game.state;
    const botPlayerIndex = this.getBotPlayerIndex(game);

    // Check if it's the bot's turn
    if (!gameState.isCurrentPlayersTurn(botPlayerIndex)) {
      return;
    }

    try {
      // Get bot decision with some delay for natural feel
      const decision = await botService.makeDecision(gameState, botPlayerIndex);

      // Schedule bot action after delay
      setTimeout(() => {
        this.executeBotAction(game, io, decision, botPlayerIndex);
      }, 2000);
    } catch (error) {
      logger.error(`Bot decision error in game ${game.id}:`, error);
      // Handle bot error gracefully - maybe skip turn or make random move
    }
  }

  /**
   * Executes the bot's chosen action
   */
  private async executeBotAction(
    game: GameModel,
    io: SocketServerType,
    action: GameActionRequestModel['action'],
    botPlayerIndex: number,
  ): Promise<void> {
    invariant(game.state, 'Game state must exist for bot action');

    const gameState = game.state;

    logger.info(`Bot executing action in game ${game.id}:`, action);

    try {
      // Execute the bot's action
      if (action.type === 'select_trump') {
        const success = gameState.setTrump(action.payload.trump);
        if (!success) {
          logger.error(`Bot failed to set trump ${action.payload.trump} in game ${game.id}`);
          return;
        }
      } else if (action.type === 'play_card') {
        const isCardPlayable = gameState.isCardPlayable(action.payload.card, botPlayerIndex);

        if (!isCardPlayable) {
          logger.error(`Bot attempted to play invalid card in game ${game.id}:`, action.payload.card);
          return;
        }

        const success = gameState.playCard(action.payload.card, botPlayerIndex);
        if (!success) {
          logger.error(`Bot failed to play card in game ${game.id}:`, action.payload.card);
          return;
        }
      }

      // Handle game state changes after bot action
      await this.handleGameStateAfterAction(game, io, action);
    } catch (error) {
      logger.error(`Error executing bot action in game ${game.id}:`, error);
    }
  }

  /**
   * Handle game state changes after any action (similar to the controller logic)
   */
  private async handleGameStateAfterAction(
    game: GameModel,
    io: SocketServerType,
    action: GameActionRequestModel['action'],
  ): Promise<void> {
    invariant(game.state, 'Game state must exist');

    const gameState = game.state;

    // Check if the game is over
    if (gameState.isGameOver()) {
      game.players.forEach((player) => {
        io.to(`${game.id}:${player.id}`).emit('game_over', {
          gameId: game.id,
        });
      });
      return;
    }

    // Check if the round is over
    if (gameState.isRoundOver()) {
      game.players.forEach((player, i) => {
        io.to(`${game.id}:${player.id}`).emit('round_over', {
          gameId: game.id,
          view: gameState.createPlayerView(i),
        });
      });
      return;
    }

    // Send game updates to all players
    game.players.forEach((player, i) => {
      // Don't send updates to the bot
      if (player.id !== 'bot') {
        io.to(`${game.id}:${player.id}`).emit('game_updated', {
          gameId: game.id,
          view: gameState.createPlayerView(i),
          action,
        });
      }
    });

    // Check if bot needs to make another move (recursive call)
    await this.handlePostGameAction(game, io);
  }

  /**
   * Get the bot player index in the game
   */
  private getBotPlayerIndex(game: GameModel): number {
    const botIndex = game.players.findIndex((player) => player.id === 'bot');
    if (botIndex === -1) {
      throw new Error(`Bot player not found in game ${game.id}`);
    }
    return botIndex;
  }
}

export const gameManager = new GameManager();
