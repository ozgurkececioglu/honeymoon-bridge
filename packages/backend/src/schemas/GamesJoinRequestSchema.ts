import { commonValidations } from "@/common/utils/commonValidation";
import { z } from "zod";

export const GamesJoinRequestSchema = z.object({
  params: z.object({ gameId: commonValidations.id }),
});
