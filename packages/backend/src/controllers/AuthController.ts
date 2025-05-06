import { sessionService } from "@/services/SessionService";
import type { Request, RequestHandler, Response } from "express";

class AuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await sessionService.login(
      req.body.username,
      req.body.password,
    );

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const authController = new AuthController();
