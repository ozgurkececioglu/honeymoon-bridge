import { UpCardModel } from "@/schemas/CardSchema";

export interface Trick {
  winnerIndex: number | null;
  cards: UpCardModel[];
}
