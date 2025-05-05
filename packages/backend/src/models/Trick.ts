import type { UpCard } from "@/models/Card";

export interface Trick {
  winnerIndex: number | null;
  cards: UpCard[];
}
