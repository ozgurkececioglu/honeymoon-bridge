import { ZodRequestBody } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

export function createApiRequestBody(
  schema: z.ZodTypeAny,
  description?: string,
): ZodRequestBody {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}
