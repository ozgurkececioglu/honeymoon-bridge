import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  HOST: z.string().min(1).default("localhost"),

  PORT: z.coerce.number().int().positive().default(8080),

  // CORS_ORIGIN can be a single URL or comma-separated list of URLs
  CORS_ORIGIN: z.string().default("http://localhost:8080"),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
  // Parse CORS origins - can be single URL or comma-separated list
  corsOrigins: parsedEnv.data.CORS_ORIGIN.split(",").map(origin => origin.trim()),
};
