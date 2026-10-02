import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').trim(),
    slug: z.string().optional(),
    tagline: z.string().optional().default(''),
    description: z.string().optional().default(''),
    image: z.string().url().optional(),
    featured: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});
