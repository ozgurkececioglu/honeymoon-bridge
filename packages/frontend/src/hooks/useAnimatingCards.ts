import { AnimatingCardsContext } from "contexts/animatingCardsContext";
import { useContext } from "react";

export function useAnimatingCards() {
  return useContext(AnimatingCardsContext);
}
