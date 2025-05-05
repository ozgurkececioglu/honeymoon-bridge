import type { Suit, UpCard } from "@/models/Card";
import { cardService } from "@/services/game-state/CardService";
import { gameStateService } from "@/services/game-state/GameStateService";
import { trickService } from "@/services/game-state/TrickService";
import { viewService } from "@/services/game-state/ViewService";

export class GameState {
  isCurrentPlayersTurn(playerIndex: number) {
    return gameStateService.isCurrentPlayersTurn(playerIndex);
  }

  isCardPlayable(card: UpCard, playerIndex: number): boolean {
    return cardService.isCardPlayable(card, playerIndex);
  }

  setTrump(trump: Suit) {
    return gameStateService.setTrumpSuit(trump);
  }

  playCard(card: UpCard, playerIndex: number) {
    return gameStateService.playCard(card, playerIndex);
  }

  isGameOver() {
    return gameStateService.isGameOver();
  }

  isRoundOver() {
    return trickService.areTricksComplete();
  }

  createPlayerSpecificState(playerIndex: number) {
    return viewService.createPlayerSpecificState(playerIndex);
  }
}
