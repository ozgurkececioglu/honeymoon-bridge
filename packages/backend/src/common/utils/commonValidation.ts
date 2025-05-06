import { Ranks, Suits } from "@/models/Card";
import { z } from "zod";

export const commonValidations = {
  id: z.string().uuid("Invalid ID format"),
  suit: z.enum(Suits),
  rank: z.enum(Ranks),
};
