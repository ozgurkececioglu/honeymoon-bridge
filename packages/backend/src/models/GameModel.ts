import { GameState } from "@/models/GameState";
import { GameInfoModel } from "@/schemas/GameInfoSchema";

export interface GameModel extends GameInfoModel {
  state?: GameState;
}
