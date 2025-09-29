import { commonValidations } from '@/common/utils/commonValidation';
import { Suits } from '@/models/Card';
import { DownCardSchema, UpCardSchema } from '@/schemas/CardSchema';
import { PlayerSchema } from '@/schemas/PlayerSchema';
import { UpDownCardsSchema } from '@/schemas/UpDownCardsSchema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type ClientViewModel = z.infer<typeof ClientViewSchema>;
export const ClientViewSchema = z
  .object({
    trumpSuit: z.enum([...Suits, 'none']).nullable(),
    isActivePlayer: z.boolean(),
    currentTrick: z.array(UpCardSchema),
    deck: z
      .object({
        playerCardsOnTable: z.array(UpDownCardsSchema),
        opponentCardsOnTable: z.array(UpDownCardsSchema),
        opponentCardsOnHand: z.array(DownCardSchema),
        hasOpponentWonAnyTricks: z.boolean(),
      })
      .and(
        z.discriminatedUnion('hasPlayerWonAnyTricks', [
          z.object({
            hasPlayerWonAnyTricks: z.literal(true),
            playerCardsOnHand: z.array(UpCardSchema),
          }),
          z.object({
            hasPlayerWonAnyTricks: z.literal(false),
            playerCardsOnHand: z.array(DownCardSchema),
          }),
        ]),
      ),
    allowedCardsToPlay: z.array(UpCardSchema).nullable(),
    currentRoundScore: z.object({
      active: z.number(),
      opponent: z.number(),
    }),
    activePlayerPlayedSuits: z.array(z.enum([...Suits, 'none'])),
    scoreboard: z.record(
      z.enum([...Suits, 'none']),
      z.object({
        active: z.number(),
        opponent: z.number(),
      }),
    ),
    isGameOver: z.boolean(),
    winner: PlayerSchema.nullable(),
  })
  .openapi('ClientView');
