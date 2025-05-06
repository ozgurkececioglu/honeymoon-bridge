import { SuitBox } from 'components/trump-suit-selector/SuitBox';
import { Suit } from 'types/swaggerAliases';

interface Props {
  playedSuits: Array<Suit | 'none'>;
  onSelectTrump: (suit: Suit | 'none') => void;
}

export const TrumpSuitSelector = ({ playedSuits, onSelectTrump }: Props) => {
  return (
    <div className="flex flex-col justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 shadow-lg rounded-lg p-4">
      <span>Select trump suit to start the round</span>
      <div className="flex gap-2 justify-center mt-2">
        <SuitBox
          isPlayed={playedSuits.some((suit) => suit === 'clubs')}
          suit="clubs"
          onClick={() => onSelectTrump('clubs')}
        />
        <SuitBox
          isPlayed={playedSuits.some((suit) => suit === 'diamonds')}
          suit="diamonds"
          onClick={() => onSelectTrump('diamonds')}
        />
        <SuitBox
          isPlayed={playedSuits.some((suit) => suit === 'hearts')}
          suit="hearts"
          onClick={() => onSelectTrump('hearts')}
        />
        <SuitBox
          isPlayed={playedSuits.some((suit) => suit === 'spades')}
          suit="spades"
          onClick={() => onSelectTrump('spades')}
        />
        <SuitBox
          isPlayed={playedSuits.some((suit) => suit === 'none')}
          suit="none"
          onClick={() => onSelectTrump('none')}
        />
      </div>
    </div>
  );
};
