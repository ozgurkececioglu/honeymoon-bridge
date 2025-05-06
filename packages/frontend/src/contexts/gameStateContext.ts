import { createContext } from 'react';
import { Suit, UpCard } from 'types/swaggerAliases';

export interface GameStateContext {
  trumpSuit: Suit | 'none' | null;
  isActivePlayer: boolean;
  allowedCardsToPlay: UpCard[] | null;
}

export const GameStateContext = createContext<GameStateContext>({
  trumpSuit: null,
  isActivePlayer: false,
  allowedCardsToPlay: null,
});
