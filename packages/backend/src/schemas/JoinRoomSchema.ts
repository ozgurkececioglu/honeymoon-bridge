import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const JoinRoomSchema = z
  .object({
    gameId: z.string().uuid().nonempty(),
  })
  .openapi("JoinRoomRequest");
