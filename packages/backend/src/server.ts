import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { SessionModel } from "@/models/SessionModel";
import { authRouter } from "@/routers/authRouter";
import { gamesRouter } from "@/routers/gamesRouter";
import { getSocketConnectionHandler } from "@/routers/gameStateRouter";
import { SocketEmitEventsMap, SocketListenEventsMap } from "@/types";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { createServer } from "node:http";
import { pino } from "pino";
import { Server } from "socket.io";

const logger = pino({ name: "server start" });
const app: Express = express();
const server = createServer(app);
const io = new Server<
  SocketListenEventsMap,
  SocketEmitEventsMap,
  {},
  { sessionId: string; session: SessionModel }
>(server, {
  cors: {
    origin: "http://localhost:5173",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

io.on("connection", getSocketConnectionHandler(io));

export { logger, server };
