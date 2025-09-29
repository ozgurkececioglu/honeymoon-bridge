import { GameState } from '@/models/GameState';
import { GameActionRequestModel, GameActionRequestSchema } from '@/schemas/GameActionRequestSchema';
import { JoinRoomSchema } from '@/schemas/JoinRoomSchema';
import { logger } from '@/server';
import { gamesService } from '@/services/GamesService';
import { sessionService } from '@/services/SessionService';
import { SocketServerType, SocketType } from '@/types';
import invariant from 'tiny-invariant';

export class GameStateController {
  public authenticate(socket: SocketType, message: { sessionId: string }) {
    logger.info(`Authentication attempt: ${JSON.stringify(message)}`);

    if (!message.sessionId) {
      return socket.emit('authenticated', {
        type: 'authentication_error',
        success: false,
        message: 'No session ID provided',
      });
    }

    const session = sessionService.verifySession(message.sessionId);

    if (!session) {
      return socket.emit('authenticated', {
        type: 'authentication_error',
        success: false,
        message: 'Invalid or expired session',
      });
    }

    // Store session info in socket for later use
    socket.data.session = session;
    socket.data.sessionId = message.sessionId;

    logger.info(`Client ${socket.id} authenticated with session ID: ${message.sessionId}`);

    socket.emit('authenticated', {
      type: 'authenticated',
      success: true,
      message: 'Authenticated successfully',
    });
  }

  public joinRoom(socket: SocketType, io: SocketServerType, message: { gameId?: string }) {
    // Check if socket is authenticated
    if (!socket.data.session || !socket.data.sessionId) {
      return socket.emit('error', { message: 'Authentication required' });
    }

    // Validate the message structure
    const result = JoinRoomSchema.safeParse(message);
    if (!result.success) {
      return socket.emit('error', {
        message: 'Invalid message format for join_room',
        details: result.error.errors.join(', '),
      });
    }

    const { gameId } = result.data;

    invariant(gameId, 'gameId is required');

    const game = gamesService.games.get(gameId);

    if (!game) {
      return socket.emit('error', {
        message: 'Game not found',
        details: `No game found with ID: ${gameId}`,
      });
    }

    logger.info(`Client ${socket.id} joining room: ${gameId}: ${socket.data.sessionId}`);

    socket.emit('room_joined', { gameId, game });

    socket.join(gameId);
    socket.join(`${gameId}:${socket.data.sessionId}`);

    // If game is full (2 players for honeymoon bridge), start the game
    if (game.players.length === 2 && game.status === 'waiting') {
      game.status = 'active';
      // Initialize game state, deal cards, etc.
      game.state = new GameState();

      // notify first player
      io.to(`${game.id}:${game.players[0].id}`).emit('game_started', {
        gameId: game.id,
        view: game.state!.createPlayerView(0),
      });

      // notify second player
      socket.emit('game_started', {
        gameId: game.id,
        view: game.state!.createPlayerView(1),
      });
    } else if (game.isAgainstBot && game.players.length === 1 && game.status === 'waiting') {
      game.status = 'active';
      // Initialize game state, deal cards, etc.
      game.state = new GameState();

      // notify first player
      io.to(`${game.id}:${game.players[0].id}`).emit('game_started', {
        gameId: game.id,
        view: game.state!.createPlayerView(0),
      });
    }
  }

  public gameAction(socket: SocketType, io: SocketServerType, message: GameActionRequestModel) {
    // Check if socket is authenticated
    if (!socket.data.session) {
      return socket.emit('error', { message: 'Authentication required' });
    }

    // Validate the message structure
    const result = GameActionRequestSchema.safeParse(message);
    if (!result.success) {
      return socket.emit('error', {
        message: 'Invalid message format for game_action',
        details: result.error.errors.join(', '),
      });
    }

    const { gameId, action } = message;

    invariant(gameId, 'gameId is required');

    const game = gamesService.games.get(gameId);

    if (!game) {
      return socket.emit('error', {
        message: 'Game not found',
        details: `No game found with ID: ${gameId}`,
      });
    }

    if (!game.state) {
      return socket.emit('error', {
        message: 'Game state not initialized',
        details: `Game state is not initialized for game ID: ${gameId}`,
      });
    }

    const gameState = game.state;

    const playerId = socket.data.session.userId;
    const playerIndex = game.players.findIndex((p) => p.id === playerId);

    if (playerIndex === -1 || !gameState.isCurrentPlayersTurn(playerIndex)) {
      return socket.emit('error', {
        message: 'Not your turn',
        details: `It's not your turn to play in game ID: ${gameId}`,
      });
    }

    if (action.type === 'select_trump') {
      const { trump } = action.payload;

      const success = gameState.setTrump(trump);

      if (!success) {
        return socket.emit('error', {
          message: 'Failed to set trump',
          details: `Trump suit ${trump} is not available`,
        });
      }
    } else if (action.type === 'play_card') {
      const { card } = action.payload;

      const isCardPlayable = gameState.isCardPlayable(card, playerIndex);

      if (!isCardPlayable) {
        return socket.emit('error', {
          message: 'Invalid card',
          details: `Card ${card.rank} of ${card.suit} is not playable`,
        });
      }

      // play the card
      const isCardPlayedSuccessfully = gameState.playCard(card, playerIndex);

      if (!isCardPlayedSuccessfully) {
        return socket.emit('error', {
          message: 'Failed to play card',
          details: `Card ${card.rank} of ${card.suit} could not be played`,
        });
      }

      // Check if the game is over
      if (gameState.isGameOver()) {
        socket.to(game.id).emit('game_over', {
          gameId: game.id,
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
    }

    game.players.forEach((player, i) => {
      io.to(`${game.id}:${player.id}`).emit('game_updated', {
        gameId: game.id,
        view: gameState.createPlayerView(i),
        action,
      });
    });
  }
}

export const gameStateController = new GameStateController();
