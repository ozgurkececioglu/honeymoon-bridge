import { Button } from 'components/button/Button';
import { DeckCard } from 'components/deck-card/DeckCard';
import { UpDownDeckCards } from 'components/up-down-deck-cards/UpDownDeckCards';
import { Suit, UpCard, VisibleDeck } from 'types/swaggerAliases';
import { getLeft } from 'utils/getLeft';
import { getSuitAssetPath } from 'utils/getSuitAssetPath';
import { isUpCard } from 'utils/isUpCard';

interface Props {
  deck: VisibleDeck;
  trumpSuit: Suit | 'none' | null;
  currentTrick?: UpCard[];
  currentRoundScore: {
    active: number;
    opponent: number;
  };

  onSelectCard: (card: UpCard) => void;
  onClickScoreboard: () => void;
}

export const CardTable = ({
  deck,
  currentTrick,
  currentRoundScore,
  trumpSuit,
  onSelectCard,
  onClickScoreboard,
}: Props) => {
  return (
    <div className="h-screen w-screen lg:w-2xl flex flex-col justify-between border border-gray-300 bg-green-700 rounded-lg shadow-lg p-8 relative">
      <OpponentSection deck={deck} />

      {currentTrick?.map((card, index) => {
        return (
          <DeckCard
            key={index}
            isDown={false}
            card={card}
            position={{
              left: '44%',
              top: '50%',
            }}
          />
        );
      })}

      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 shadow-lg rounded-lg p-4 opacity-50 flex flex-col items-center gap-1">
        <div className="text-lg font-bold flex justify-between items-center gap-2">
          Round:{' '}
          <span>
            {currentRoundScore.active}-{currentRoundScore.opponent}
          </span>
        </div>

        {trumpSuit && (
          <div className="text-lg font-bold w-full flex justify-between items-center gap-2 pr-2">
            Trump: {trumpSuit !== 'none' ? <img className="w-4 h-4" src={getSuitAssetPath(trumpSuit)} /> : 'None'}
          </div>
        )}

        <Button variant="secondary" onClick={onClickScoreboard}>
          Scoreboard
        </Button>
      </div>

      <PlayerSection deck={deck} onSelectCard={onSelectCard} />
    </div>
  );
};

const OpponentSection = ({ deck }: { deck: VisibleDeck }) => {
  return (
    <>
      {deck.opponentCardsOnHand.map((card, index) => {
        if (!deck.hasOpponentWonAnyTricks) {
          return (
            <DeckCard
              isDown={true}
              key={card.id}
              card={card}
              position={{ left: `${100 - 5 - index * 1}%`, top: '10%' }}
            />
          );
        }

        const left = getLeft({
          numberOfItems: deck.opponentCardsOnHand!.length,
          index,
          gap: 12,
        });

        return <DeckCard isDown={true} key={card.id} card={card} position={{ left: `${left}%`, top: '10%' }} />;
      })}

      {deck.opponentCardsOnTable.map((cardOnTable, index) => (
        <UpDownDeckCards key={index} cardOnTable={cardOnTable} index={index} />
      ))}
    </>
  );
};

const PlayerSection = ({ deck, onSelectCard }: { deck: VisibleDeck; onSelectCard: (card: UpCard) => void }) => {
  return (
    <>
      {deck.playerCardsOnTable.map((cardOnTable, index) => (
        <UpDownDeckCards
          key={index}
          cardOnTable={cardOnTable}
          index={index}
          isPlayerCard
          onClick={() => {
            if (cardOnTable.upCard) {
              onSelectCard(cardOnTable.upCard);
            }
          }}
        />
      ))}

      {deck.playerCardsOnHand.map((card, index) => {
        if (!isUpCard(card)) {
          return (
            <DeckCard
              key={card.id}
              isDown={true}
              isPlayerCard
              card={card}
              position={{ left: `${5 + index * 1}%`, top: '90%' }}
            />
          );
        }

        const left = getLeft({
          numberOfItems: deck.playerCardsOnHand!.length,
          index,
          gap: 12,
        });

        return (
          <DeckCard
            key={card.id}
            isDown={false}
            isPlayerCard
            card={card}
            onClick={() => {
              onSelectCard(card);
            }}
            position={{ left: `${left}%`, top: '90%' }}
          />
        );
      })}
    </>
  );
};
