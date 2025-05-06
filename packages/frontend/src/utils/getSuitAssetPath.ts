import club from 'assets/club.svg';
import diamond from 'assets/diamond.svg';
import heart from 'assets/heart.svg';
import spade from 'assets/spade.svg';
import { Suit } from 'types/swaggerAliases';

export function getSuitAssetPath(suit: Suit) {
  switch (suit) {
    case 'clubs':
      return club;
    case 'diamonds':
      return diamond;
    case 'hearts':
      return heart;
    case 'spades':
      return spade;
  }
}
