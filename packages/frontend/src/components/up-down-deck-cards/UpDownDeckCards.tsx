import { DeckCard } from 'components/deck-card/DeckCard';
import { Fragment } from 'react/jsx-runtime';
import { UpDownCards } from 'types/swaggerAliases';
import { getLeft } from 'utils/getLeft';

interface Props {
  index: number;
  isPlayerCard?: boolean;
  cardOnTable: UpDownCards;
  onClick?: () => void;
}

export const UpDownDeckCards = ({ isPlayerCard, cardOnTable, onClick, index }: Props) => {
  const left = getLeft({ numberOfItems: 5, index: index % 5, gap: 18 });
  const top = isPlayerCard ? 70 : 20;

  const { downCard, upCard } = cardOnTable;

  if (upCard === null) {
    return null;
  }

  if (downCard !== null) {
    return (
      <Fragment key={index}>
        <DeckCard
          isDown={true}
          card={downCard}
          position={{
            left: `${left}%`,
            top: `${index < 5 ? top : top + 10}%`,
          }}
        />
        <DeckCard
          isDown={false}
          card={upCard}
          position={{
            left: `${left + 2}%`,
            top: `${index < 5 ? top + 1 : top + 11}%`,
          }}
          onClick={onClick}
          isPlayerCard={isPlayerCard}
        />
      </Fragment>
    );
  }

  return (
    <DeckCard
      key={index}
      isDown={false}
      card={upCard}
      position={{
        left: `${left + 0.5}%`,
        top: `${index < 5 ? top + 0.5 : top + 10.5}%`,
      }}
      onClick={onClick}
      isPlayerCard={isPlayerCard}
    />
  );
};
