import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type PlayerModel = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z
  .object({
    id: z.string(),
    username: z.string(),
  })
  .openapi('Player');
