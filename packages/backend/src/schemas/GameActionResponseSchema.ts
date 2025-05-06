import { ClientViewSchema } from "@/schemas/ClientViewSchema";
import { GameActionRequestSchema } from "@/schemas/GameActionRequestSchema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type GameActionResponseModel = z.infer<typeof GameActionResponseSchema>;
export const GameActionResponseSchema = GameActionRequestSchema.extend({
  view: ClientViewSchema,
}).openapi("GameActionResponse");
