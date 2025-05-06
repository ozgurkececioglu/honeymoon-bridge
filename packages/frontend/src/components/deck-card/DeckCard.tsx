import backOfCard from 'assets/back-of-card.svg';
import { getSuitAssetPath } from 'utils/getSuitAssetPath';
import { useAnimatingCards } from 'hooks/useAnimatingCards';
import { useGameState } from 'hooks/useGameState';
import { motion } from 'motion/react';
import cx from 'utils/classNames';
import { DownCard, UpCard } from 'types/swaggerAliases';

const shrinkAnimation = {
  animate: {
    scale: 0.9,
  },
  transition: {
    duration: 0.2,
  },
};

type Props = {
  isPlayerCard?: boolean;

  position: {
    left: number | string;
    top: number | string;
  };

  onClick?: () => void;
} & ({ isDown: true; card: DownCard } | { isDown: false; card: UpCard });

export const DeckCard = ({ card, isDown, isPlayerCard, position, onClick }: Props) => {
  const { allowedCardsToPlay, isActivePlayer, trumpSuit } = useGameState();
  const { animatingCards, animationType } = useAnimatingCards();

  const isAllowedCardToPlay =
    !isDown &&
    (allowedCardsToPlay === null ||
      allowedCardsToPlay.length === 0 ||
      allowedCardsToPlay.some((allowedCard) => allowedCard.rank === card.rank && allowedCard.suit === card.suit));

  const canHoverAnimate = !!trumpSuit && isActivePlayer && isPlayerCard && !isDown;

  const handleClick = () => {
    if (onClick && !!trumpSuit && !isDown && isActivePlayer && isPlayerCard && isAllowedCardToPlay) {
      onClick();
    }
  };

  const shrinkAnimationProps = canHoverAnimate && !isAllowedCardToPlay ? shrinkAnimation : undefined;
  const animatingCardIndex = animatingCards?.findIndex((animatingCard) => animatingCard.id === card.id) ?? -1;

  const playAnimationProps =
    animatingCardIndex >= 0 ? getPlayAnimation(animationType, animatingCardIndex, position) : undefined;

  return (
    <motion.div
      style={{ ...position }}
      {...playAnimationProps}
      {...shrinkAnimationProps}
      whileHover={canHoverAnimate && isAllowedCardToPlay ? { scale: 1.1 } : undefined}
      className={cx('drop-shadow-xl/50 rounded w-16 h-24 absolute -translate-x-1/2 -translate-y-1/2', {
        'cursor-pointer': canHoverAnimate && isAllowedCardToPlay,
      })}
      onClick={handleClick}
    >
      {canHoverAnimate && !isAllowedCardToPlay && (
        <div className="absolute inset-0 bg-gray-500 opacity-50 rounded z-10"></div>
      )}
      {animatingCards?.[animatingCardIndex] ? (
        <CardContent card={animatingCards?.[animatingCardIndex]} />
      ) : !isDown ? (
        <CardContent card={card} />
      ) : (
        <img src={backOfCard} alt="back of card" className="w-16 h-24 rounded" />
      )}
    </motion.div>
  );
};

function CardContent({ card }: { card: UpCard }) {
  const isRedSuit = card.suit === 'hearts' || card.suit === 'diamonds';

  const textColor = isRedSuit ? 'text-red-600' : 'text-black';
  const borderColor = isRedSuit ? 'border-red-600' : 'border-black';

  return (
    <div className={cx('relative w-16 h-24 bg-slate-200 rounded font-bold', textColor)}>
      <div className={cx('absolute left-2 top-2.5 bottom-2.5 border-2 rounded w-9/12', borderColor)}></div>
      <h1 className="absolute right-0 top-0 bg-slate-200 w-5 roundended rounded-full">{card.rank}</h1>
      <h1 className="absolute bottom-0 left-0 rotate-180 bg-slate-200 w-5 roundended rounded-full">{card.rank}</h1>
      <img
        src={getSuitAssetPath(card.suit)}
        className="top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 absolute"
      />
    </div>
  );
}

function getPlayAnimation(
  animationType: 'to-player' | 'to-opponent' | 'to-middle' | null,
  animatingCardIndex: number,
  position: {
    left: number | string;
    top: number | string;
  },
) {
  if (animationType === null) {
    return undefined;
  }

  if (animationType === 'to-middle') {
    return {
      animate: {
        top: '50%',
        left: '44%',
        zIndex: 10,
      },
      transition: {
        duration: 0.2,
      },
    };
  }

  const left = animatingCardIndex === 1 ? '56%' : '44%';

  if (animationType === 'to-player') {
    return {
      animate: {
        top: [position.top, '50%', '50%', '110%'],
        left: [position.left, left, left, left],
        zIndex: [10, 10, 10, 10],
      },
      transition: {
        duration: 0.9,
        times: [0, 0.25, 0.75, 1],
        ease: 'easeInOut',
      },
    };
  }

  return {
    animate: {
      top: [position.top, '50%', '50%', '-10%'],
      left: [position.left, left, left, left],
      zIndex: [10, 10, 10, 10],
    },
    transition: {
      duration: 0.9,
      times: [0, 0.25, 0.75, 1],
      ease: 'easeInOut',
    },
  };
}
