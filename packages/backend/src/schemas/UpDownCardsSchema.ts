import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type UpDownCardsModel = z.infer<typeof UpDownCardsSchema>;
export const UpDownCardsSchema = z
  .object({
    upCard: z
      .object({
        id: commonValidations.id,
        suit: commonValidations.suit,
        rank: commonValidations.rank,
      })
      .nullable(),
    downCard: z
      .object({
        id: commonValidations.id,
      })
      .nullable(),
  })
  .openapi("UpDownCards");
