import { UpCardModel } from "@/schemas/CardSchema";

export interface PlayableCard extends UpCardModel {
  isPlayed: boolean;
}
