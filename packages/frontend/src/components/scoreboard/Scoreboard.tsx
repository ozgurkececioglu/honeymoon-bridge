import { Button } from 'components/button/Button';
import { ClientView, Suit } from 'types/swaggerAliases';
import { getSuitAssetPath } from 'utils/getSuitAssetPath';

interface Props {
  scores: ClientView['scoreboard'];
  onClose: () => void;
}

const suits: Array<Suit | 'none'> = ['clubs', 'diamonds', 'hearts', 'spades', 'none'];

export const Scoreboard = ({ scores, onClose }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-md bg-slate-200 p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Suit</th>
              <th className="border border-gray-300 px-4 py-2 w-2/5">Active</th>
              <th className="border border-gray-300 px-4 py-2 w-2/5">Opponent</th>
            </tr>
          </thead>
          <tbody>
            {suits.map((suit) => (
              <Row key={suit} suit={suit} scores={scores[suit]} />
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ suit, scores }: { suit: Suit | 'none'; scores: ClientView['scoreboard'][Suit | 'none'] }) => {
  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {suit !== 'none' ? <img className="w-full h-4" src={getSuitAssetPath(suit)} alt={suit} /> : 'None'}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">{scores?.active ?? '--'}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{scores?.opponent ?? '--'}</td>
    </tr>
  );
};
