import { z } from 'zod';

export const getUserByEmailSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});
