import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export const LoginRequestSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});
