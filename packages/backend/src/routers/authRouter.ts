import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "@/api/user/userModel";
import { authController } from "@/controllers/AuthController";
import { LoginResponseSchema } from "@/schemas/LoginResponseSchema";
import { validateRequest } from "@/common/utils/httpHandlers";
import { LoginRequestSchema } from "@/schemas/LoginRequestSchema";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

// authRegistry.register("User", UserSchema);

// authRegistry.registerPath({
//   method: "post",
//   path: "/api/login",
//   tags: ["Login"],
//   responses: createApiResponse(z.array(LoginResponseSchema), "Success"),
// });

authRouter.post(
  "/login",
  validateRequest(LoginRequestSchema),
  authController.login
);
