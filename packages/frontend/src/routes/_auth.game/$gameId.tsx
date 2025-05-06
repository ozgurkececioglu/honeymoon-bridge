import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { CardTable } from 'components/card-table/CardTable';
import { Scoreboard } from 'components/scoreboard/Scoreboard';
import { TrumpSuitSelector } from 'components/trump-suit-selector/TrumpSuitSelector';
import { AnimatingCardsContext } from 'contexts/animatingCardsContext';
import { GameStateContext } from 'contexts/gameStateContext';
import { useAuth } from 'hooks/useAuth';
import { useWebSocket } from 'hooks/useWebSocket';
import { useState } from 'react';
import { Suit, UpCard } from 'types/swaggerAliases';
import { z } from 'zod';

export const Route = createFileRoute('/_auth/game/$gameId')({
  beforeLoad: ({ params }) => {
    // validate params.gameId for uuid format
    if (!params.gameId || !z.string().uuid().safeParse(params.gameId).success) {
      throw redirect({
        to: '/lobby',
        search: {
          redirect: '/_auth/game',
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = useAuth();
  const { gameId } = useParams({ from: '/_auth/game/$gameId' });

  const [showScoreboard, setShowScoreboard] = useState(false);

  const { gameState, sendMessage, hasGameStarted, animatingCards } = useWebSocket(
    'http://localhost:3000',
    sessionId,
    gameId,
  );

  const handleSelectTrump = (trump: Suit | 'none') => {
    sendMessage({
      gameId,
      action: {
        type: 'select_trump',
        payload: {
          trump,
        },
      },
    });
  };

  const handleSelectCard = (card: UpCard) => {
    sendMessage({
      gameId,
      action: {
        type: 'play_card',
        payload: {
          card,
        },
      },
    });
  };

  if (gameState.isGameOver) {
    return <div>Game Over! Winner: {gameState.winner?.username}</div>;
  }

  if (!hasGameStarted) {
    return <div>Waiting for players to join...</div>;
  }

  if (!gameState.deck) {
    return <div>Loading...</div>;
  }

  return (
    <GameStateContext.Provider value={gameState}>
      <AnimatingCardsContext.Provider value={animatingCards}>
        <CardTable
          deck={gameState.deck}
          trumpSuit={gameState.trumpSuit}
          currentTrick={gameState.currentTrick}
          currentRoundScore={gameState.currentRoundScore}
          onSelectCard={handleSelectCard}
          onClickScoreboard={() => setShowScoreboard(true)}
        />

        {!gameState.isActivePlayer && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 shadow-lg rounded-lg p-4 opacity-50">
            Waiting for opponent to play...
          </div>
        )}

        {gameState.isActivePlayer && gameState.trumpSuit === null && (
          <TrumpSuitSelector playedSuits={gameState.activePlayerPlayedSuits} onSelectTrump={handleSelectTrump} />
        )}

        {showScoreboard && <Scoreboard scores={gameState.scoreboard} onClose={() => setShowScoreboard(false)} />}
      </AnimatingCardsContext.Provider>
    </GameStateContext.Provider>
  );
}
