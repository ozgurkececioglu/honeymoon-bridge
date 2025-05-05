import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest, validateSession } from "@/common/utils/httpHandlers";
import { gamesController } from "@/controllers/GamesController";
import { GameSchema } from "@/schemas/GameSchema";
import { GamesCreateRequestSchema } from "@/schemas/GamesCreateRequestSchema";
import { GamesJoinRequestSchema } from "@/schemas/GamesJoinRequestSchema";
import { z } from "zod";

export const gamesRegistry = new OpenAPIRegistry();
export const gamesRouter: Router = express.Router();

gamesRouter.use(validateSession);

gamesRegistry.register("GamesCreateRequestSchema", GamesCreateRequestSchema);

gamesRegistry.registerPath({
  method: "post",
  path: "/create",
  tags: ["Games"],
  responses: createApiResponse(GamesCreateRequestSchema, "Success"),
});

gamesRouter.post(
  "/create",
  validateRequest(GamesCreateRequestSchema),
  gamesController.createGame
);

gamesRegistry.registerPath({
  method: "post",
  path: "/{id}/join",
  tags: ["Games"],
  request: { params: GamesJoinRequestSchema.shape.params },
  responses: createApiResponse(GameSchema, "Success"),
});

gamesRouter.post(
  "/:gameId/join",
  validateRequest(GamesJoinRequestSchema),
  gamesController.joinGame
);

gamesRegistry.registerPath({
  method: "get",
  path: "/",
  tags: ["Games"],
  responses: createApiResponse(z.array(GameSchema), "Success"),
});

gamesRouter.get("/", gamesController.getGames);
