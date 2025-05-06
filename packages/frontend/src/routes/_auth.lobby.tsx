import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'components/button/Button';
import { useAuth } from 'hooks/useAuth';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GameInfo } from 'types/swaggerAliases';

export const Route = createFileRoute('/_auth/lobby')({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = useAuth();
  const navigate = useNavigate({ from: '/lobby' });

  const [openGames, setOpenGames] = useState<GameInfo[]>([]);

  useEffect(() => {
    const getGames = async () => {
      try {
        const res = await fetch('/api/games', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionId}`,
          },
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const { data } = await res.json();

        setOpenGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    if (sessionId) {
      getGames();
    }
  }, [sessionId]);

  const handleCreateGame = async () => {
    try {
      const res = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          name: 'New Game',
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const { data } = await res.json();

      if (data.id) {
        navigate({ to: `/game/${data.id}` });
      }
    } catch (error) {
      console.error('Error during game creation:', error);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      const res = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const { data } = await res.json();

      if (data.id) {
        navigate({ to: `/game/${data.id}` });
      }
    } catch (error) {
      console.error('Error during game joining:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl pb-10">Welcome to the Game Lobby</h1>

      <div className="flex justify-end">
        <Button startIcon={<Plus />} onClick={handleCreateGame}>
          New
        </Button>
      </div>

      {openGames.length > 0 ? (
        <div className="flex flex-col divide-y divide-gray-300 gap-4">
          <h2>Open Games</h2>
          <div className="grid grid-cols-2 gap-4">
            {openGames.map((game) => (
              <div
                key={game.id}
                className="flex flex-col justify-between items-center py-2 border border-gray-300 rounded-lg shadow-md"
              >
                {game.createdBy}
                <Button onClick={() => handleJoinGame(game.id)}>Join</Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 italic">No open games available.</p>
      )}
    </div>
  );
}
