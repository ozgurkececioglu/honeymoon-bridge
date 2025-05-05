import type { GameState } from "@/models/GameState";
import type { Player } from "@/models/Player";

export interface GameModel {
  id: string;
  players: Player[];
  name: string; // Name of the game
  status: "waiting" | "active" | "completed";
  createdBy: string; // User ID of the creator
  createdAt: Date;
}
