import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type GamesCreateRequest = z.infer<typeof GamesCreateRequestSchema>;
export const GamesCreateRequestSchema = z
  .object({
    body: z.object({
      name: z.string().min(1, { message: "Name is required" }),
    }),
  })
  .openapi("GamesCreateRequest");
