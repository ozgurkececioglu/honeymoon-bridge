import { Suits } from "@/models/Card";
import { UpCardSchema } from "@/schemas/CardSchema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type GameActionRequestModel = z.infer<typeof GameActionRequestSchema>;
export const GameActionRequestSchema = z
  .object({
    gameId: z.string().uuid().nonempty(),
    action: z
      .object({
        type: z.literal("select_trump"),
        payload: z.object({
          trump: z.enum([...Suits, "none"]),
        }),
      })
      .or(
        z.object({
          type: z.literal("play_card"),
          payload: z.object({
            card: UpCardSchema,
          }),
        }),
      ),
  })
  .openapi("GameActionRequest");
