import type { Suit, UpCard } from "@/models/Card";
import type { Trick } from "@/models/Trick";
import invariant from "tiny-invariant";

export class TrickService {
  private tricks: Array<Trick>;
  private currentTrick: UpCard[];

  constructor() {
    this.tricks = [];
    this.currentTrick = [];
  }

  resetTricks(): void {
    this.tricks = [];
    this.currentTrick = [];
  }

  getTricks(): Array<Trick> {
    return this.tricks;
  }

  getCurrentTrick(): UpCard[] {
    return this.currentTrick;
  }

  hasPlayerWinAnyTricks(playerIndex: number): boolean {
    return this.tricks.some((trick) => trick.winnerIndex === playerIndex);
  }

  isFirstCardOfTrick(): boolean {
    return this.currentTrick.length === 0;
  }

  getExistingSuit(): Suit | null {
    if (this.isFirstCardOfTrick()) {
      return null;
    }

    invariant(
      this.currentTrick[0],
      "Current trick should have at least one card"
    );

    return this.currentTrick[0].suit;
  }

  doesCardMatchSuit(card: UpCard): boolean {
    // Check if the card has the same suit as the existing cards on the current trick
    const existingSuit = this.getExistingSuit();

    return card.suit === existingSuit;
  }

  addCardToTrick(card: UpCard): void {
    this.currentTrick.push(card);
  }

  isTrickComplete(): boolean {
    return this.currentTrick.length === 2;
  }

  addTrick(winnerIndex: number): void {
    this.tricks.push({
      winnerIndex,
      cards: this.currentTrick,
    });
    this.currentTrick = [];
  }

  areTricksComplete(): boolean {
    return this.tricks.length === 26;
  }

  private getCardValue(card: UpCard) {
    const rankValues: Record<string, number> = {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };

    return rankValues[card.rank] || -1;
  }

  getWinnerOfTrick(trumpSuit: Suit | "none"): number {
    const [firstCard, secondCard] = this.currentTrick;

    invariant(
      firstCard && secondCard,
      "Both cards should be present in the current trick"
    );

    const firstCardValue = this.getCardValue(firstCard);
    const secondCardValue = this.getCardValue(secondCard);

    if (firstCard.suit === secondCard.suit) {
      return firstCardValue > secondCardValue ? 0 : 1;
    }

    if (trumpSuit === "none") {
      return 0;
    }

    if (firstCard.suit === trumpSuit) {
      return 0;
    }

    if (secondCard.suit === trumpSuit) {
      return 1;
    }

    return 0;
  }
}

export const trickService = new TrickService();
