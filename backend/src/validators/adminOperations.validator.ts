import { z } from 'zod';

export const updateStockSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID parameter is required'),
  }),
  body: z.object({
    stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(2, 'Coupon code must be at least 2 characters')
      .max(50, 'Coupon code cannot exceed 50 characters')
      .transform((val) => val.trim().toUpperCase()),
    type: z.enum(['percentage', 'fixed'], {
      errorMap: () => ({ message: "Type must be either 'percentage' or 'fixed'" }),
    }),
    value: z.number().positive('Discount value must be greater than 0'),
    minSpend: z.number().min(0, 'Minimum spend cannot be negative').optional().default(0),
    expiryDate: z.string().min(4, 'Valid expiration date is required'),
    usageLimit: z.number().int().positive().nullable().optional(),
    active: z.boolean().optional().default(true),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Coupon ID parameter is required'),
  }),
  body: z.object({
    code: z.string().min(2).max(50).optional(),
    type: z.enum(['percentage', 'fixed']).optional(),
    value: z.number().positive().optional(),
    minSpend: z.number().min(0).optional(),
    expiryDate: z.string().optional(),
    usageLimit: z.number().int().positive().nullable().optional(),
    active: z.boolean().optional(),
  }),
});

export const createPublicReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    author: z.string().min(2, 'Author name must be at least 2 characters'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(2, 'Review title must be at least 2 characters'),
    comment: z.string().min(5, 'Review comment must be at least 5 characters'),
  }),
});

export const updateReviewStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Review ID parameter is required'),
  }),
  body: z.object({
    status: z.string().min(1, 'Status is required'),
  }),
});
