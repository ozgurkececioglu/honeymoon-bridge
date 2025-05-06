import type { Suit } from "@/models/Card";
import { UpCardModel } from "@/schemas/CardSchema";
import { cardService } from "@/services/game-state/CardService";
import { gameStateService } from "@/services/game-state/GameStateService";
import { trickService } from "@/services/game-state/TrickService";
import { viewService } from "@/services/game-state/ViewService";

export class GameState {
  isCurrentPlayersTurn(playerIndex: number) {
    return gameStateService.isCurrentPlayersTurn(playerIndex);
  }

  isCardPlayable(card: UpCardModel, playerIndex: number): boolean {
    return cardService.isCardPlayable(card, playerIndex);
  }

  setTrump(trump: Suit | "none") {
    return gameStateService.setTrumpSuit(trump);
  }

  playCard(card: UpCardModel, playerIndex: number) {
    return gameStateService.playCard(card, playerIndex);
  }

  isGameOver() {
    return gameStateService.isGameOver();
  }

  isRoundOver() {
    return trickService.areTricksComplete();
  }

  createPlayerView(playerIndex: number) {
    return viewService.createPlayerView(playerIndex);
  }
}
