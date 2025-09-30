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
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Allow any origin in development
      if (env.isDevelopment) return callback(null, true);

      // Check if origin is in allowed list
      if (env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check for localhost origins in development/preview
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }

      // Check for Vercel preview deployments
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to support multiple origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    // Allow any origin in development
    if (env.isDevelopment) return callback(null, true);

    // Check if origin is in allowed list
    if (env.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check for localhost origins in development/preview
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    // Check for Vercel preview deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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
