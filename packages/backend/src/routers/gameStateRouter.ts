import { createApiRequestBody } from "@/api-docs/openAPIRequestBuilders";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { gameStateController } from "@/controllers/GameStateController";
import { GameActionRequestSchema } from "@/schemas/GameActionRequestSchema";
import { GameActionResponseSchema } from "@/schemas/GameActionResponseSchema";
import { GameInfoSchema } from "@/schemas/GameInfoSchema";
import { logger } from "@/server";
import { SocketServerType, SocketType } from "@/types";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const gameStateRegistry = new OpenAPIRegistry();

// Authentication event
gameStateRegistry.registerPath({
  method: "post",
  path: "/socket/authenticate",
  tags: ["Socket"],
  request: {
    body: createApiRequestBody(
      z
        .object({
          sessionId: z.string(),
        })
        .openapi("AuthenticateRequest"),
    ),
  },
  responses: createApiResponse(
    z
      .object({
        type: z.string(),
        success: z.boolean(),
        message: z.string(),
      })
      .openapi("AuthenticateResponse"),
    "Success",
  ),
});

// Join room event
gameStateRegistry.registerPath({
  method: "post",
  path: "/socket/join_room",
  tags: ["Socket"],
  request: {
    body: createApiRequestBody(
      z
        .object({
          gameId: z.string().optional(),
        })
        .openapi("JoinRoomRequest"),
    ),
  },
  responses: createApiResponse(
    z
      .object({
        gameId: z.string(),
        game: GameInfoSchema,
      })
      .openapi("JoinRoomResponse"),
    "Success",
  ),
});

// Game action event
gameStateRegistry.registerPath({
  method: "post",
  path: "/socket/game_action",
  tags: ["Socket"],
  request: {
    body: createApiRequestBody(GameActionRequestSchema),
  },
  responses: createApiResponse(GameActionResponseSchema, "Success"),
});

export const getSocketConnectionHandler =
  (io: SocketServerType) => (socket: SocketType) => {
    logger.info("New client connected");

    socket.on("disconnect", () => {
      logger.info("Client disconnected");
    });

    socket.on("authenticate", async (message) =>
      gameStateController.authenticate(socket, message),
    );

    socket.on("join_room", (message) =>
      gameStateController.joinRoom(socket, io, message),
    );

    socket.on("game_action", (message) =>
      gameStateController.gameAction(socket, io, message),
    );
  };
