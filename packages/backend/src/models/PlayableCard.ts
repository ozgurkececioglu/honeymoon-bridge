import type { UpCard } from "@/models/Card";

export interface PlayableCard extends UpCard {
  isPlayed: boolean;
}
