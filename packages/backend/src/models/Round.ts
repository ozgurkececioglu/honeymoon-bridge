import type { Suit } from "@/models/Card";

export interface Round {
  playerIndex: number;
  trumpSuit: Suit | "none";
  score: number;
}
