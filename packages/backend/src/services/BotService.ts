import { GameState } from '@/models/GameState';
import { GameActionRequestModel } from '@/schemas/GameActionRequestSchema';
import { UpCardModel } from '@/schemas/CardSchema';
import { logger } from '@/server';
import { Suits, type Suit } from '@/models/Card';
import { ClientViewModel } from '@/schemas/ClientViewSchema';
import { UpDownCardsModel } from '@/schemas/UpDownCardsSchema';
import invariant from 'tiny-invariant';

export type BotDecision = GameActionRequestModel['action'];

export class BotService {
  /**
   * Makes a decision for the bot player based on current game state
   */
  public async makeDecision(gameState: GameState, playerIndex: number): Promise<BotDecision> {
    const playerView = gameState.createPlayerView(playerIndex);

    // Determine what type of action the bot needs to make
    if (this.needsToSelectTrump(playerView)) {
      return this.selectTrump(playerView);
    } else {
      return this.selectCard(gameState, playerIndex);
    }
  }

  /**
   * Determines if bot needs to select trump suit
   */
  private needsToSelectTrump(playerView: ClientViewModel): boolean {
    // Add your logic here based on the game rules
    // This would depend on your game state structure
    return playerView.trumpSuit === null;
  }

  /**
   * Bot logic for selecting trump suit
   */
  private async selectTrump(playerView: ClientViewModel): Promise<BotDecision> {
    // Implement your bot's trump selection strategy
    // For now, simple logic - could be enhanced with AI algorithms
    const availableSuits = Suits.filter((suit) => playerView.activePlayerPlayedSuits.includes(suit) === false);
    const selectedTrump = this.chooseBestTrump(playerView, availableSuits);

    logger.info(`Bot selecting trump: ${selectedTrump}`);

    return {
      type: 'select_trump',
      payload: { trump: selectedTrump },
    };
  }

  /**
   * Bot logic for selecting a card to play
   */
  private async selectCard(gameState: GameState, playerIndex: number): Promise<BotDecision> {
    const playerView = gameState.createPlayerView(playerIndex);
    const playableCards = this.getPlayableCards(playerView);

    logger.info(`Bot has ${playableCards.length} playable cards`);

    if (playableCards.length === 0) {
      throw new Error('Bot has no playable cards');
    }

    const selectedCard = this.chooseBestCard(playableCards, playerView);

    logger.info(`Bot playing card: ${selectedCard.rank} of ${selectedCard.suit}`);

    return {
      type: 'play_card',
      payload: { card: selectedCard },
    };
  }

  /**
   * Get all cards that the bot can legally play
   */
  private getPlayableCards(playerView: ClientViewModel): UpCardModel[] {
    if (playerView.allowedCardsToPlay && playerView.allowedCardsToPlay.length > 0) {
      return playerView.allowedCardsToPlay;
    }

    const tableCards = playerView.deck.playerCardsOnTable
      .map((c) => c.upCard)
      .filter((c): c is UpCardModel => c !== null);
    const handCards = playerView.deck.hasPlayerWonAnyTricks ? playerView.deck.playerCardsOnHand : [];

    return [...tableCards, ...handCards];
  }

  /**
   * Simple trump selection strategy - can be enhanced
   */
  private chooseBestTrump(playerView: ClientViewModel, availableSuits: Array<Suit | 'none'>): Suit | 'none' {
    // Simple strategy: count cards in each suit and pick the strongest
    const suitCounts = this.analyzeSuitDistribution(playerView.deck.playerCardsOnTable);

    // Find suit with most cards (simple strategy)
    let bestSuit: Suit | 'none' = 'none';
    let maxCount = 0;

    for (const suit of availableSuits) {
      if (suit !== 'none' && suitCounts[suit] > maxCount) {
        maxCount = suitCounts[suit];
        bestSuit = suit;
      }
    }

    return bestSuit;
  }

  /**
   * Simple card selection strategy - can be enhanced with AI
   */
  private chooseBestCard(playableCards: UpCardModel[], playerView: ClientViewModel): UpCardModel {
    // Simple strategy: play the highest card if leading, lowest if following
    const isLeading = this.isBotLeading(playerView);

    invariant(playerView.trumpSuit !== null, 'Trump suit must be selected before playing a card');

    if (isLeading) {
      // Play highest card when leading
      return this.getHighestCardOfASuit(playableCards, playerView.trumpSuit);
    } else {
      // check if there is any card that can win the trick
      const currentTrick = playerView.currentTrick;
      const leadingSuit = currentTrick.length > 0 ? currentTrick[0].suit : null;

      invariant(leadingSuit !== null, 'Leading suit must be defined when following');

      // Try to play the lowest card that can win the trick
      const cardsWithSameSuit = playableCards.filter((card) => card.suit === leadingSuit);

      if (cardsWithSameSuit.length > 0) {
        // Play the lowest winning card
        const { lowest, winner } = cardsWithSameSuit.reduce<{ winner: UpCardModel | null; lowest: UpCardModel }>(
          ({ lowest, winner }, card) => {
            if (this.isHigherThan(card, currentTrick[0]) && (winner === null || this.isLowerThan(card, winner))) {
              return { winner: card, lowest };
            }

            if (lowest === null || this.isLowerThan(card, lowest)) {
              return { winner, lowest: card };
            }

            return { winner, lowest };
          },
          { winner: null, lowest: cardsWithSameSuit[0] },
        );

        if (winner) {
          return winner;
        } else {
          // No winning card, play the lowest card of the leading suit
          return lowest;
        }
      } else if (leadingSuit === playerView.trumpSuit) {
        // No winning card, play the lowest card possible
        return this.getLowestCardOfASuit(playableCards, leadingSuit);
      } else {
        // No cards of leading suit, play the lowest trump card
        const trumpCards = playableCards.filter((card) => card.suit === playerView.trumpSuit);

        if (trumpCards.length > 0) {
          return this.getLowestCardOfASuit(trumpCards, playerView.trumpSuit);
        } else {
          // No trump cards, play the lowest card overall
          return this.getLowestCardOfASuit(playableCards, 'none');
        }
      }
    }
  }

  /**
   * Analyze suit distribution in hand
   */
  private analyzeSuitDistribution(cardsOnTable: UpDownCardsModel[]): Record<string, number> {
    const counts: Record<string, number> = {
      hearts: 0,
      diamonds: 0,
      clubs: 0,
      spades: 0,
    };

    for (const card of cardsOnTable) {
      if (card.upCard?.suit) {
        counts[card.upCard.suit] = (counts[card.upCard.suit] || 0) + 1;
      }
    }

    return counts;
  }

  /**
   * Determine if bot is leading the trick
   */
  private isBotLeading(playerView: ClientViewModel): boolean {
    // This depends on your game state structure
    return !playerView.currentTrick || playerView.currentTrick.length === 0;
  }

  /**
   * Get numeric value of card for comparison
   */
  private getCardValue(card: UpCardModel): number {
    const rankValues: Record<string, number> = {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };

    return rankValues[card.rank] || 0;
  }

  private getLowestCardOfASuit(cards: UpCardModel[], suit: Suit | 'none'): UpCardModel {
    return cards.reduce((lowest, card) => {
      if (suit !== 'none' && card.suit !== suit) return lowest;

      return this.isLowerThan(card, lowest) ? card : lowest;
    });
  }

  private getHighestCardOfASuit(cards: UpCardModel[], suit: Suit | 'none'): UpCardModel {
    return cards.reduce((highest, card) => {
      if (suit !== 'none' && card.suit !== suit) return highest;

      return this.isHigherThan(card, highest) ? card : highest;
    });
  }

  private isLowerThan(cardA: UpCardModel, cardB: UpCardModel): boolean {
    return this.getCardValue(cardA) < this.getCardValue(cardB);
  }

  private isHigherThan(cardA: UpCardModel, cardB: UpCardModel): boolean {
    return this.getCardValue(cardA) > this.getCardValue(cardB);
  }
}

export const botService = new BotService();
