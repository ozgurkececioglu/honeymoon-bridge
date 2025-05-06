import { AnimatingCardsContextType } from 'contexts/animatingCardsContext';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ClientView, GameActionRequest, GameActionResponse } from 'types/swaggerAliases';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd',
  },
});

export function useWebSocket(url: string, sessionId: string, gameId: string | null) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [gameState, setGameState] = useState<ClientView>({
    trumpSuit: null,
    isActivePlayer: false,
    currentTrick: [],
    allowedCardsToPlay: null,
    deck: {
      hasOpponentWonAnyTricks: false,
      hasPlayerWonAnyTricks: false,
      opponentCardsOnHand: [],
      playerCardsOnHand: [],
      opponentCardsOnTable: [],
      playerCardsOnTable: [],
    },
    currentRoundScore: {
      active: 0,
      opponent: 0,
    },
    activePlayerPlayedSuits: [],
    scoreboard: {},

    isGameOver: false,
    winner: null,
  });
  const [animatingCards, setAnimatingCards] = useState<AnimatingCardsContextType>({
    currentTrick: [],
    animatingCards: null,
    animationType: null,
  });

  useEffect(() => {
    const handleConnect = () => {
      socket.emit('authenticate', { sessionId });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    };

    const handleAuthenticated = (success: true) => {
      console.log('Authenticated successfully!', success);
      socket.emit('join_room', { sessionId, gameId });
    };

    const handleJoinRoom = () => {
      console.log('Joined room successfully!');
      setIsConnected(true);
    };

    const handleGameStarted = ({ view }: GameActionResponse) => {
      console.log('Game started successfully!', view);
      setGameState(view);
      setHasGameStarted(true);
    };

    const handleGameUpdated = ({ action, view }: GameActionResponse) => {
      const { type, payload } = action;

      console.log('Game state updated:', type, payload);

      const newState = view;

      if (type === 'play_card') {
        const { card } = payload;

        setAnimatingCards((prev) => {
          if (prev.currentTrick.length === 0) {
            return {
              currentTrick: newState.currentTrick,
              animatingCards: [card],
              animationType: 'to-middle',
            };
          }

          return {
            currentTrick: [...prev.currentTrick, card],
            animatingCards: [...prev.currentTrick, card],
            animationType: newState.isActivePlayer ? 'to-player' : 'to-opponent',
          };
        });

        setTimeout(() => {
          setAnimatingCards((prev) => ({
            currentTrick: prev.currentTrick.length === 2 ? [] : prev.currentTrick,
            animatingCards: null,
            animationType: null,
          }));
          setGameState(newState);
        }, 1000); // Adjust the duration as needed
      } else {
        setGameState(newState);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('authenticated', handleAuthenticated);
    socket.on('room_joined', handleJoinRoom);
    socket.on('game_started', handleGameStarted);

    socket.on('game_updated', handleGameUpdated);

    // Cleanup function
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('authenticated', handleAuthenticated);
      socket.off('room_joined', handleJoinRoom);
      socket.off('game_started', handleGameStarted);
      socket.off('game_updated', handleGameUpdated);
    };
  }, [gameId, sessionId, url]); // Dependencies

  return {
    isConnected,
    animatingCards,
    gameState,
    hasGameStarted,
    sendMessage: (msg: GameActionRequest) => socket.emit('game_action', msg),
  };
}
