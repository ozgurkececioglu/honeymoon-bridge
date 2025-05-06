export const Suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export type Suit = (typeof Suits)[number];

export const Ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;
export type Rank = (typeof Ranks)[number];
