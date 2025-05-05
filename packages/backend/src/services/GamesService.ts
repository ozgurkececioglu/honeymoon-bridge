import { ServiceResponse } from "@/common/models/ServiceResponse";
import type { GameModel } from "@/models/GameModel";
import { logger } from "@/server";
import { sessionService } from "@/services/SessionService";
import { StatusCodes } from "http-status-codes";
import invariant from "tiny-invariant";
import { v4 as uuid } from "uuid";

export class GamesService {
  games: Map<string, GameModel> = new Map();

  getGames(sessionId: string): ServiceResponse<GameModel[] | null> {
    const session = sessionService.verifySession(sessionId);

    invariant(session, "Session not found");

    const games = Array.from(this.games.values()).filter(
      (game) => game.players.length < 2
    );

    return ServiceResponse.success<GameModel[] | null>(
      "Games retrieved",
      games
    );
  }

  createGame(
    sessionId: string,
    name: string
  ): ServiceResponse<GameModel | null> {
    const session = sessionService.verifySession(sessionId);
    const gameId = uuid();

    invariant(session, "Session not found");

    // Initialize game
    const game: GameModel = {
      id: gameId,
      name,
      createdBy: session.userId,
      players: [{ id: session.userId, username: session.username }],
      status: "waiting",
      createdAt: new Date(),
    };

    this.games.set(gameId, game);

    return ServiceResponse.success<GameModel | null>("Game created", game);
  }

  joinGame(
    sessionId: string,
    gameId: string
  ): ServiceResponse<GameModel | null> {
    const session = sessionService.verifySession(sessionId);

    invariant(session, "Session not found");

    const game = this.games.get(gameId);

    if (!game) {
      return ServiceResponse.failure<GameModel | null>(
        "Game not found",
        null,
        StatusCodes.NOT_FOUND
      );
    }

    if (game.players.length === 2) {
      return ServiceResponse.failure<GameModel | null>(
        "Game is full",
        null,
        StatusCodes.FORBIDDEN
      );
    }

    // Add player to the game if not already there
    if (!game.players.some((p) => p.id === session.userId)) {
      game.players.push({
        id: session.userId,
        username: session.username,
      });
    }

    return ServiceResponse.success<GameModel | null>(
      "Player joined game",
      game
    );
  }
}

export const gamesService = new GamesService();
