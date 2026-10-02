import { z } from 'zod';

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Promo code is required').trim(),
    subtotal: z.number().nonnegative().optional().default(0),
  }),
});
