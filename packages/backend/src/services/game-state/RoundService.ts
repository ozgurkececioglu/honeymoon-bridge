import type { Suit } from "@/models/Card";
import type { Round } from "@/models/Round";
import { trickService } from "@/services/game-state/TrickService";
import invariant from "tiny-invariant";

export class RoundService {
  private rounds: Round[];

  constructor() {
    this.rounds = [];
  }

  addRound(round: Round): void {
    this.rounds.push(round);
  }

  isTrumpAvailableForPlayer(
    trump: string,
    currentPlayerIndex: number
  ): boolean {
    return !this.rounds.some(
      (round) =>
        round.trumpSuit === trump && round.playerIndex === currentPlayerIndex
    );
  }

  getRounds(): Round[] {
    return this.rounds;
  }

  getRoundResult(trumpSuit: Suit | "none") {
    const { first, second } = trickService.getTricks().reduce(
      (acc, trick) => {
        if (trick.winnerIndex === 0) {
          acc.first += 1;
        } else if (trick.winnerIndex === 1) {
          acc.second += 1;
        }

        return acc;
      },
      { first: 0, second: 0 }
    );

    let score = Math.abs(first - second);

    /**
     * Spades: 1 point per trick won
     * Hearts: 2 points per trick won
     * Diamonds: 3 points per trick won
     * Clubs: 4 points per trick won
     * None: 5 points per trick won
     */
    if (trumpSuit === "spades") {
      score *= 1;
    } else if (trumpSuit === "hearts") {
      score *= 2;
    } else if (trumpSuit === "diamonds") {
      score *= 3;
    } else if (trumpSuit === "clubs") {
      score *= 4;
    } else if (trumpSuit === "none") {
      score *= 5;
    }

    return {
      winnerIndex: first > second ? 0 : 1,
      score,
    };
  }

  getCurrentRound(): Round | undefined {
    if (this.rounds.length === 0) {
      return undefined;
    }

    invariant(
      this.rounds[this.rounds.length - 1],
      "The last round should always exist"
    );

    return this.rounds[this.rounds.length - 1];
  }

  isGameOver(): boolean {
    return this.rounds.length === 10;
  }

  getWinnerOfGame() {
    const { first, second } = this.rounds.reduce(
      (acc, round) => {
        if (round.playerIndex === 0) {
          acc.first += round.score;
        } else {
          acc.second += round.score;
        }

        return acc;
      },
      { first: 0, second: 0 }
    );

    if (first > second) {
      return 0; // First player wins
    } else if (second > first) {
      return 1; // Second player wins
    } else {
      return null; // It's a draw
    }
  }

  getPlayedSuits(playerIndex: number): Array<Suit | "none"> {
    return this.rounds.reduce<Array<Suit | "none">>((acc, round) => {
      const roundKey = round.trumpSuit;

      if (round.playerIndex === playerIndex) {
        return [...acc, roundKey];
      }

      return acc;
    }, []);
  }
}

export const roundService = new RoundService();
