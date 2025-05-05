import type { DownCard, UpCard, UpDownCards } from "@packages/shared-types";

export type VisibleDeck = {
  playerCardsOnTable: UpDownCards[];

  opponentCardsOnTable: UpDownCards[];
  opponentCardsOnHand: Array<DownCard>;
  hasOpponentWonAnyTricks: boolean;
} & (
  | { hasPlayerWonAnyTricks: true; playerCardsOnHand: Array<UpCard> }
  | { hasPlayerWonAnyTricks: false; playerCardsOnHand: Array<DownCard> }
);
