import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type GameInfoModel = z.infer<typeof GameInfoSchema>;
export const GameInfoSchema = z
  .object({
    id: z.string(),
    players: z.array(
      z.object({
        id: z.string(),
        username: z.string(),
      }),
    ),
    name: z.string(), // Name of the game
    status: z.enum(["waiting", "active", "completed"]),
    createdBy: z.string(), // User ID of the creator
    createdAt: z.date(),
  })
  .openapi("GameInfo");
