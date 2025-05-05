import type { Suit, UpCard } from "@/models/Card";
import { deckService } from "@/services/game-state/DeckService";
import { roundService } from "@/services/game-state/RoundService";
import { trickService } from "@/services/game-state/TrickService";
import invariant from "tiny-invariant";

export class GameStateService {
  private trumpSuit: Suit | "none" | null;

  private currentPlayerIndex: number;

  private gameOver: boolean;
  private winnerIndex: number | null;

  constructor() {
    this.trumpSuit = null;
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.winnerIndex = null;
  }

  isActivePlayer(playerIndex: number) {
    return this.currentPlayerIndex === playerIndex;
  }

  resetGameState() {
    this.trumpSuit = null;

    const currentRound = roundService.getCurrentRound();

    invariant(
      currentRound,
      "Current round should be defined when resetting game state"
    );

    this.currentPlayerIndex = (currentRound.playerIndex + 1) % 2;
  }

  isCurrentPlayersTurn(playerIndex: number) {
    return this.currentPlayerIndex === playerIndex;
  }

  getTrumpSuit() {
    return this.trumpSuit;
  }

  setTrumpSuit(trump: Suit) {
    if (this.trumpSuit !== null) {
      return false;
    }

    if (
      !roundService.isTrumpAvailableForPlayer(trump, this.currentPlayerIndex)
    ) {
      return false;
    }

    this.trumpSuit = trump;

    roundService.addRound({
      playerIndex: this.currentPlayerIndex,
      trumpSuit: trump,
      score: 0,
    });

    return true;
  }

  prepareForNewRound() {
    deckService.resetDeck();
    this.resetGameState();
    trickService.resetTricks();
  }

  playCard(card: UpCard, playerIndex: number) {
    const { card: playableCard } = deckService.getCardById(card.id);

    if (!playableCard) {
      return false;
    }

    playableCard.isPlayed = true;

    trickService.addCardToTrick(card);
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;

    if (trickService.isTrickComplete() && this.trumpSuit !== null) {
      const winnerCardIndex = trickService.getWinnerOfTrick(this.trumpSuit);
      const winnerOfTrickIndex =
        winnerCardIndex === 1 ? playerIndex : (playerIndex + 1) % 2;

      this.currentPlayerIndex = winnerOfTrickIndex;

      trickService.addTrick(winnerOfTrickIndex);

      // Check if the round is over
      if (trickService.areTricksComplete()) {
        const { score, winnerIndex } = roundService.getRoundResult(
          trickService,
          this.trumpSuit
        );
        const currentRound = roundService.getCurrentRound();

        invariant(
          currentRound,
          "Current round should be defined when the round is over"
        );

        currentRound.score =
          currentRound.playerIndex === winnerIndex ? score : -score;

        // Check if the game is over
        if (roundService.isGameOver()) {
          this.gameOver = true;

          this.winnerIndex = roundService.getWinnerOfGame();

          return true;
        }

        this.prepareForNewRound();
      }
    }

    return true;
  }

  isGameOver() {
    return this.gameOver;
  }
}

export const gameStateService = new GameStateService();
