import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    author: z.string().min(2, 'Name must be at least 2 characters').trim(),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(2, 'Title must be at least 2 characters').trim(),
    comment: z.string().min(5, 'Review comment must be at least 5 characters').trim(),
  }),
});
