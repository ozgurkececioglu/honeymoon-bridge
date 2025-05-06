import { gamesService } from "@/services/GamesService";
import type { Request, RequestHandler, Response } from "express";
import invariant from "tiny-invariant";

export class GamesController {
  public createGame: RequestHandler = async (req: Request, res: Response) => {
    const { sessionId } = req;
    const name = req.body?.name;

    invariant(sessionId, "Session ID is required");
    invariant(name, "Game name is required");

    const serviceResponse = await gamesService.createGame(sessionId, name);

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public joinGame: RequestHandler = async (req: Request, res: Response) => {
    const { sessionId } = req;
    const gameId = req.params.gameId;

    invariant(sessionId, "Session ID is required");
    invariant(gameId, "Game ID is required");

    const serviceResponse = await gamesService.joinGame(sessionId, gameId);

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getGames: RequestHandler = async (req: Request, res: Response) => {
    const { sessionId } = req;

    invariant(sessionId, "Session ID is required");

    const serviceResponse = await gamesService.getGames(sessionId);

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const gamesController = new GamesController();
