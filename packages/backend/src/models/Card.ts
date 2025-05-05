export const Suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export type Suit = (typeof Suits)[number];

export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export interface UpCard {
  id: string;
  suit: Suit;
  rank: Rank;
}

export interface DownCard {
  id: string;
}
