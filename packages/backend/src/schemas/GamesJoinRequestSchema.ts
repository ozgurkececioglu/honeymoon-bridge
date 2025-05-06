import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const GamesJoinRequestSchema = z
  .object({
    params: z.object({ gameId: commonValidations.id }),
  })
  .openapi("GamesJoinRequest");
