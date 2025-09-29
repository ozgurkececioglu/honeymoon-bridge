import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest, validateSession } from '@/common/utils/httpHandlers';
import { gamesController } from '@/controllers/GamesController';
import { GameInfoSchema } from '@/schemas/GameInfoSchema';
import { GamesCreateRequestSchema } from '@/schemas/GamesCreateRequestSchema';
import { GamesJoinRequestSchema } from '@/schemas/GamesJoinRequestSchema';
import { z } from 'zod';
import { createApiRequestBody } from '@/api-docs/openAPIRequestBuilders';

export const gamesRegistry = new OpenAPIRegistry();
export const gamesRouter: Router = express.Router();

gamesRouter.use(validateSession);

gamesRegistry.registerPath({
  method: 'post',
  path: '/api/games/create',
  tags: ['Games'],
  request: { body: createApiRequestBody(GamesCreateRequestSchema) },
  responses: createApiResponse(GamesCreateRequestSchema, 'Success'),
});

gamesRouter.post('/create', validateRequest(GamesCreateRequestSchema), gamesController.createGame);

gamesRegistry.registerPath({
  method: 'post',
  path: '/api/games/create/bot',
  tags: ['Games'],
  responses: createApiResponse(z.object({}), 'Success'),
});

gamesRouter.post('/create/bot', gamesController.createGameAgainstBot);

gamesRegistry.registerPath({
  method: 'post',
  path: '/api/games/{id}/join',
  tags: ['Games'],
  request: { body: createApiRequestBody(GamesJoinRequestSchema) },
  responses: createApiResponse(GameInfoSchema, 'Success'),
});

gamesRouter.post('/:gameId/join', validateRequest(GamesJoinRequestSchema), gamesController.joinGame);

gamesRegistry.registerPath({
  method: 'get',
  path: '/api/games',
  tags: ['Games'],
  responses: createApiResponse(z.array(GameInfoSchema), 'Success'),
});

gamesRouter.get('/', gamesController.getGames);
