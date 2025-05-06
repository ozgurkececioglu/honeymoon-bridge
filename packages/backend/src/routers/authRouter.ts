import { createApiRequestBody } from '@/api-docs/openAPIRequestBuilders';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';
import { authController } from '@/controllers/AuthController';
import { LoginRequestSchema } from '@/schemas/LoginRequestSchema';
import { LoginResponseSchema } from '@/schemas/LoginResponseSchema';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: 'post',
  path: '/api/login',
  tags: ['Login'],
  request: { body: createApiRequestBody(LoginRequestSchema) },
  responses: createApiResponse(LoginResponseSchema, 'Success'),
});

authRouter.post('/login', validateRequest(LoginRequestSchema), authController.login);
