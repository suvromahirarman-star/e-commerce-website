import { z } from 'zod';

export const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
    password: z.string().min(4, 'Password must be at least 4 characters'),
  }),
});
