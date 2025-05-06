import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type UpCardModel = z.infer<typeof UpCardSchema>;
export const UpCardSchema = z
  .object({
    id: commonValidations.id,
    suit: commonValidations.suit,
    rank: commonValidations.rank,
  })
  .openapi("UpCard");

export type DownCardModel = z.infer<typeof DownCardSchema>;
export const DownCardSchema = z
  .object({
    id: commonValidations.id,
  })
  .openapi("DownCard");
