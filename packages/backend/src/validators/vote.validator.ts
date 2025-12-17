import { z } from 'zod';

export const getVotesSchema = z.object({
  query: z
    .object({
      featureId: z.string().uuid().optional(),
      userEmail: z.string().email().optional(),
    })
    .optional(),
});
