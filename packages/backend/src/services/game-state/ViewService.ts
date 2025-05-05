import type { ClientView } from "@/models/ClientView";
import type { VisibleDeck } from "@/models/VisibleDeck";
import { cardService } from "@/services/game-state/CardService";
import { deckService } from "@/services/game-state/DeckService";
import { gameStateService } from "@/services/game-state/GameStateService";
import { roundService } from "@/services/game-state/RoundService";
import { scoreService } from "@/services/game-state/ScoreService";
import { trickService } from "@/services/game-state/TrickService";

export class ViewService {
  createPlayerSpecificState(playerIndex: number): ClientView {
    const deck: VisibleDeck = {
      playerCardsOnTable: [],
      opponentCardsOnTable: [],
      opponentCardsOnHand: [],
      hasOpponentWonAnyTricks: trickService.hasPlayerWinAnyTricks(
        (playerIndex + 1) % 2
      ),
      hasPlayerWonAnyTricks: trickService.hasPlayerWinAnyTricks(playerIndex),
      playerCardsOnHand: [],
    };

    const activePlayerRawCards = deckService.getPlayersCards(playerIndex);
    const opponentRawCards = deckService.getPlayersCards((playerIndex + 1) % 2);
    const isActivePlayer = gameStateService.isActivePlayer(playerIndex);

    deck.playerCardsOnTable = cardService.processPlayerCardsOnTable(
      activePlayerRawCards.table
    );
    deck.playerCardsOnHand = cardService.processPlayerCardsOnHand(
      activePlayerRawCards.hand,
      !!deck.hasPlayerWonAnyTricks
    );
    deck.opponentCardsOnTable = cardService.processPlayerCardsOnTable(
      opponentRawCards.table
    );
    deck.opponentCardsOnHand = opponentRawCards.hand
      .filter((card) => !card.isPlayed)
      .map((card) => ({
        id: card.id,
      }));

    const allowedCardsToPlay = cardService.getAllowedCardsToPlay(
      deck,
      isActivePlayer
    );

    return {
      isActivePlayer,
      trumpSuit: gameStateService.getTrumpSuit(),
      currentTrick: trickService.getCurrentTrick(),

      deck,
      allowedCardsToPlay,

      currentRoundScore: scoreService.getCurrentRoundScore(
        trickService,
        playerIndex
      ),

      isGameOver: gameStateService.isGameOver(),
      winner: null,

      activePlayerPlayedSuits: roundService.getPlayedSuits(playerIndex),
      scoreboard: scoreService.getScoreboard(roundService, playerIndex),
    };
  }
}

export const viewService = new ViewService();
