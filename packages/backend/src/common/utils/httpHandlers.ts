import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/ServiceResponse";
import { sessionService } from "@/services/SessionService";
import { logger } from "@/server";

export const validateRequest =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      const errorMessage = `Invalid input: ${(err as ZodError).issues
        .map((e) => e.message)
        .join(", ")}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        null,
        statusCode
      );
      res.status(serviceResponse.statusCode).send(serviceResponse);
    }
  };

export const validateSession: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId =
    req.headers.authorization?.split(" ")[1] || req.cookies?.sessionId;

  if (!sessionId) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "No session provided" });

    return;
  }

  try {
    // Validate session from your storage (database, Redis, etc.)
    const session = await sessionService.verifySession(sessionId);

    if (!session) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid or expired session" });

      return;
    }

    // Attach session data to request for later use
    req.userId = session.userId;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Session validation failed" });
  }
};
