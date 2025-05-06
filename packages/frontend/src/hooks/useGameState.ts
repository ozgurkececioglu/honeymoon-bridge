import { GameStateContext } from "contexts/gameStateContext";
import { useContext } from "react";

export function useGameState() {
  return useContext(GameStateContext);
}
