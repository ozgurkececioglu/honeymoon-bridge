import { ServiceResponse } from "@/common/models/ServiceResponse";
import type { SessionModel } from "@/models/SessionModel";
import { v4 as uuid } from "uuid";

export class SessionService {
  sessions: Map<string, SessionModel> = new Map();

  async login(
    email: string,
    password: string
  ): Promise<ServiceResponse<{ sessionId: string } | null>> {
    // Simulate a login process
    const sessionId = uuid();
    this.sessions.set(sessionId, {
      id: sessionId,
      userId: sessionId,
      username: email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
    });

    return ServiceResponse.success<{ sessionId: string }>("Login successful", {
      sessionId,
    });
  }

  verifySession(sessionId: string): SessionModel | null {
    return this.sessions.get(sessionId) || null;
  }
}

export const sessionService = new SessionService();
