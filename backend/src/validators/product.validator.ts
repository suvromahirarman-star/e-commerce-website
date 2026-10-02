import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    categorySlug: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    rating: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    inStock: z.string().optional().transform((val) => val === 'true'),
    size: z.string().optional(),
    color: z.string().optional(),
    sort: z
      .enum(['newest', 'price-asc', 'price-desc', 'price-low-to-high', 'price-high-to-low', 'rating', 'popular'])
      .optional()
      .transform((val) => {
        if (val === 'price-low-to-high') return 'price-asc';
        if (val === 'price-high-to-low') return 'price-desc';
        return val;
      }),
    isFeatured: z.string().optional().transform((val) => (val !== undefined ? val === 'true' : undefined)),
    isBestseller: z.string().optional().transform((val) => (val !== undefined ? val === 'true' : undefined)),
    isNewArrival: z.string().optional().transform((val) => (val !== undefined ? val === 'true' : undefined)),
    isFlashSale: z.string().optional().transform((val) => (val !== undefined ? val === 'true' : undefined)),
    status: z.enum(['draft', 'published', 'archived', 'all']).optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 24)),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters').trim(),
    slug: z.string().optional(),
    brand: z.string().optional().default('AURA Atelier'),
    category: z.string().min(1, 'Category name is required'),
    categorySlug: z.string().min(1, 'Category slug is required'),
    price: z.number().positive('Price must be greater than 0'),
    originalPrice: z.number().nullable().optional(),
    stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
    sku: z.string().optional(),
    badge: z.string().nullable().optional(),
    description: z.string().optional().default(''),
    overview: z.string().optional().default(''),
    images: z.array(z.string().url()).optional().default([]),
    colors: z
      .array(
        z.object({
          name: z.string(),
          hex: z.string(),
        })
      )
      .optional()
      .default([]),
    sizes: z.array(z.string()).optional().default([]),
    specifications: z.record(z.string()).optional().default({}),
    isFeatured: z.boolean().optional().default(false),
    isBestseller: z.boolean().optional().default(false),
    isNewArrival: z.boolean().optional().default(false),
    isFlashSale: z.boolean().optional().default(false),
    status: z.enum(['draft', 'published', 'archived']).optional().default('published'),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export const reorderImagesSchema = z.object({
  body: z.object({
    imageUrls: z.array(z.string()).min(1, 'At least one image URL required for reordering'),
  }),
});
