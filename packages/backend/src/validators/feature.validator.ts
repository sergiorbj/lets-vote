import { z } from 'zod';

export const createFeatureSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters'),
    createdByEmail: z.string().email('Invalid email format'),
  }),
});

export const getFeatureByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid feature ID'),
  }),
});

export const voteOnFeatureSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid feature ID'),
  }),
  body: z.object({
    userEmail: z.string().email('Invalid email format'),
  }),
});
