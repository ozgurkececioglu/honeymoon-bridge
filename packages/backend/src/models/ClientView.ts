import type { Suit, UpCard } from "@/models/Card";
import type { Player } from "@/models/Player";
import type { VisibleDeck } from "@/models/VisibleDeck";

export interface ClientView {
  trumpSuit: Suit | "none" | null;

  isActivePlayer: boolean;
  currentTrick: UpCard[];

  deck: VisibleDeck;
  allowedCardsToPlay: UpCard[] | null;
  currentRoundScore: {
    active: number;
    opponent: number;
  };

  activePlayerPlayedSuits: Array<Suit | "none">;
  scoreboard: Partial<
    Record<
      Suit | "none",
      {
        active: number;
        opponent: number;
      }
    >
  >;

  isGameOver: boolean;
  winner: Player | null;
}
