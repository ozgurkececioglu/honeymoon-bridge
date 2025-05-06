import type { PlayableCard } from "@/models/PlayableCard";
import { DownCardModel, UpCardModel } from "@/schemas/CardSchema";
import { ClientViewModel } from "@/schemas/ClientViewSchema";
import { UpDownCardsModel } from "@/schemas/UpDownCardsSchema";
import { deckService } from "@/services/game-state/DeckService";
import { trickService } from "@/services/game-state/TrickService";
import invariant from "tiny-invariant";

export class CardService {
  processPlayerCardsOnTable(playerCards: PlayableCard[]): UpDownCardsModel[] {
    const result = new Array<UpDownCardsModel>(10);

    for (let i = 0; i < 10; i++) {
      const upCard = playerCards[i * 2];
      const downCard = playerCards[i * 2 + 1];

      invariant(upCard, "upCard should not be null");
      invariant(downCard, "downCard should not be null");

      if (!upCard.isPlayed) {
        result[i] = {
          upCard,
          downCard: { id: downCard.id },
        };
      } else if (!downCard.isPlayed) {
        result[i] = {
          upCard: downCard,
          downCard: null,
        };
      } else {
        result[i] = {
          upCard: null,
          downCard: null,
        };
      }
    }

    return result;
  }

  processPlayerCardsOnHand<T extends boolean>(
    cardsOnHand: PlayableCard[],
    hasActivePlayerWonAnyTricks: T
  ): T extends true ? UpCardModel[] : DownCardModel[] {
    if (hasActivePlayerWonAnyTricks) {
      return cardsOnHand.filter((card) => !card.isPlayed);
    }

    return cardsOnHand.map((card) => ({ id: card.id })) as T extends true
      ? UpCardModel[]
      : DownCardModel[];
  }

  isCardLogicallyPlayable(
    attemptedCard: UpCardModel,
    playerIndex: number
  ): boolean {
    const { card: foundCard, index: foundCardIndex } = deckService.getCardById(
      attemptedCard.id
    );

    if (!foundCard || foundCard.isPlayed) {
      return false;
    }

    // Check if the card belongs to the player
    if (!deckService.hasCardBlongToPlayer(foundCardIndex, playerIndex)) {
      return false;
    }

    // Check if the card is on the table and playable
    if (
      deckService.isDownCardOnTable(foundCardIndex) &&
      !deckService.getCardByIndex(foundCardIndex - 1)?.isPlayed
    ) {
      return false;
    }

    return true;
  }

  isCardPlayable(attemptedCard: UpCardModel, playerIndex: number): boolean {
    if (!this.isCardLogicallyPlayable(attemptedCard, playerIndex)) {
      return false;
    }

    if (trickService.doesCardMatchSuit(attemptedCard)) {
      return true;
    }

    // Check if the card is following the lead for the current suit
    const currentPlayerCards = deckService.getPlayersCards(playerIndex);
    const existingSuit = trickService.getExistingSuit();

    if (
      (trickService.hasPlayerWinAnyTricks(playerIndex) &&
        currentPlayerCards.hand.some(
          (card) => card.suit === existingSuit && !card.isPlayed
        )) ||
      this.processPlayerCardsOnTable(currentPlayerCards.table).some(
        (cardOnTable) => cardOnTable.upCard?.suit === existingSuit
      )
    ) {
      return false;
    }

    return true;
  }

  getAllowedCardsToPlay(
    deck: ClientViewModel["deck"],
    isActivePlayer: boolean
  ): UpCardModel[] | null {
    if (!isActivePlayer) {
      return null;
    }

    const currentTrick = trickService.getCurrentTrick();

    if (currentTrick.length === 0) {
      return null;
    }

    const allowedCardsToPlay: UpCardModel[] = [];
    const existingSuit = currentTrick[0]!.suit;

    deck.playerCardsOnTable.forEach((cardOnTable) => {
      if (cardOnTable.upCard?.suit === existingSuit) {
        allowedCardsToPlay.push(cardOnTable.upCard);
      }
    });

    if (deck.hasPlayerWonAnyTricks) {
      deck.playerCardsOnHand?.forEach((cardOnHand) => {
        if ("suit" in cardOnHand && cardOnHand.suit === existingSuit) {
          allowedCardsToPlay.push(cardOnHand);
        }
      });
    }

    return allowedCardsToPlay;
  }
}

export const cardService = new CardService();
