import { UpCard } from "@/models/Card";
import { PlayableCard } from "@/models/PlayableCard";
import { v4 as uuid } from "uuid";

export class DeckService {
  // 52 cards
  // first 20 cards are player 1's cards on table (0-19)
  // second 20 cards are player 2's cards on table (20-39)
  // next 6 cards are player 1's cards on hand (40-45)
  // last 6 cards are player 2's cards on hand (46-51)
  private deck: Array<PlayableCard>;

  constructor() {
    this.deck = this.generateRandomizedDeckOfCards();
  }

  private generateRandomizedDeckOfCards(): PlayableCard[] {
    const suits: Array<UpCard["suit"]> = [
      "hearts",
      "diamonds",
      "clubs",
      "spades",
    ];
    const values: Array<UpCard["rank"]> = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const deck: PlayableCard[] = [];

    for (const suit of suits) {
      for (const value of values) {
        deck.push({
          id: uuid(),
          rank: value,
          suit,
          isPlayed: false,
        });
      }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i]!, deck[j]!] = [deck[j]!, deck[i]!];
    }

    return deck;
  }

  resetDeck(): void {
    this.deck = this.generateRandomizedDeckOfCards();
  }

  getDeck(): Array<PlayableCard> {
    return this.deck;
  }

  getCardById(cardId: string): {
    index: number;
    card: PlayableCard | undefined;
  } {
    const index = this.deck.findIndex((deckCard) => deckCard.id === cardId);

    if (index === -1) {
      return { index: -1, card: undefined };
    }

    return { index, card: this.deck[index]! };
  }

  getCardByIndex(cardIndex: number): PlayableCard | undefined {
    if (cardIndex < 0 || cardIndex >= this.deck.length) {
      return undefined;
    }

    return this.deck[cardIndex];
  }

  isDownCardOnTable(cardIndex: number): boolean {
    return cardIndex < 40 && cardIndex % 2 === 1;
  }

  hasCardBlongToPlayer(cardIndex: number, playerIndex: number): boolean {
    return (
      ((cardIndex < 20 || (cardIndex >= 40 && cardIndex <= 45)) &&
        playerIndex === 0) ||
      (((cardIndex >= 20 && cardIndex < 40) || cardIndex >= 46) &&
        playerIndex === 1)
    );
  }

  getPlayersCards(playerIndex: number) {
    if (playerIndex === 0) {
      return {
        table: this.deck.slice(0, 20),
        hand: this.deck.slice(40, 46),
      };
    }

    return { table: this.deck.slice(20, 40), hand: this.deck.slice(46, 52) };
  }
}

export const deckService = new DeckService();
