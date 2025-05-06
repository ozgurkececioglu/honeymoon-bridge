import { motion } from 'motion/react';
import { getSuitAssetPath } from 'utils/getSuitAssetPath';
import cx from 'utils/classNames';
import { Suit } from 'types/swaggerAliases';

interface Props {
  isPlayed?: boolean;
  suit: Suit | 'none';
  onClick?: () => void;
}

export const SuitBox = ({ isPlayed, suit, onClick }: Props) => {
  const suitSource = suit !== 'none' ? getSuitAssetPath(suit) : '';
  let multiply: number = 5;

  if (suit === 'clubs') {
    multiply = 1;
  } else if (suit === 'spades') {
    multiply = 4;
  } else if (suit === 'hearts') {
    multiply = 3;
  } else if (suit === 'diamonds') {
    multiply = 2;
  }

  return (
    <motion.div
      className={cx(
        'shadow-lg/20 rounded-lg bg-gray-50 relative w-20 h-24 flex flex-col justify-center items-center cursor-pointer text-center',
        {
          'bg-gray-300': isPlayed,
        },
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
    >
      {suit !== 'none' ? (
        <img src={suitSource} alt="suit" width="50%" height="50%" />
      ) : (
        <span className="w-1/2 h-1/2">No Trump</span>
      )}
      <span className="text-lg">x{multiply}</span>
    </motion.div>
  );
};
