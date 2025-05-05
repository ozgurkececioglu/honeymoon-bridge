import type { Suit } from "@/models/Card";
import { roundService } from "@/services/game-state/RoundService";
import { trickService } from "@/services/game-state/TrickService";

export class ScoreService {
  getCurrentRoundScore(playerIndex: number) {
    return trickService.getTricks().reduce<{
      active: number;
      opponent: number;
    }>(
      (acc, trick) => {
        if (trick.winnerIndex === playerIndex) {
          return {
            ...acc,
            active: acc.active + 1,
          };
        } else if (trick.winnerIndex !== null) {
          return {
            ...acc,
            opponent: acc.opponent + 1,
          };
        }

        return acc;
      },
      { active: 0, opponent: 0 }
    );
  }

  getScoreboard(playerIndex: number) {
    return roundService
      .getRounds()
      .reduce<
        Partial<Record<Suit | "none", { active: number; opponent: number }>>
      >((acc, round) => {
        const roundKey = round.trumpSuit;
        const currentScore = acc[roundKey] || { active: 0, opponent: 0 };

        if (round.playerIndex === playerIndex) {
          const roundScore = round.score;

          return {
            ...acc,
            [roundKey]: {
              active: roundScore,
              opponent: currentScore.opponent,
            },
          };
        } else {
          const roundScore = -round.score;

          return {
            ...acc,
            [roundKey]: {
              active: currentScore.active,
              opponent: roundScore,
            },
          };
        }
      }, {});
  }
}

export const scoreService = new ScoreService();
