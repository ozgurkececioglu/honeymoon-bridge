import { createContext } from 'react';
import { UpCard } from 'types/swaggerAliases';

export interface AnimatingCardsContextType {
  currentTrick: UpCard[];
  animatingCards: UpCard[] | null;
  animationType: 'to-middle' | 'to-player' | 'to-opponent' | null;
}

export const AnimatingCardsContext = createContext<AnimatingCardsContextType>({
  currentTrick: [],
  animatingCards: null,
  animationType: null,
});
