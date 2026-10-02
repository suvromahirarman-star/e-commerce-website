import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().min(2, 'Customer full name must be at least 2 characters'),
      email: z.string().email('Valid customer email address is required'),
      phone: z.string().min(6, 'Valid customer contact number is required'),
      address: z.string().optional(),
    }),
    shippingAddress: z
      .object({
        street: z.string().optional(),
        apartment: z.string().optional(),
        city: z.string().optional(),
        division: z.string().optional(),
        postalCode: z.string().optional(),
        notes: z.string().optional(),
      })
      .optional(),
    streetAddress: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    division: z.string().optional(),
    postalCode: z.string().optional(),
    deliveryNotes: z.string().optional(),

    items: z
      .array(
        z.object({
          productId: z.string().min(1, 'Product ID is required'),
          quantity: z.number().int().positive('Quantity must be an integer greater than 0'),
          selectedColor: z.string().optional(),
          selectedSize: z.string().optional(),
          price: z.number().optional(),
          name: z.string().optional(),
        })
      )
      .min(1, 'At least one item is required in the shopping bag'),

    couponCode: z.string().nullable().optional(),
    paymentMethod: z.string().optional().default('Cash on Delivery'),
    paymentDetails: z.any().optional(),
    pricing: z.any().optional(),
  }),
});

export const orderQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    paymentMethod: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID parameter is required'),
  }),
  body: z
    .object({
      orderStatus: z.string().optional(),
      status: z.string().optional(),
      paymentStatus: z.string().optional(),
    })
    .refine((data) => data.orderStatus || data.status, {
      message: 'Either orderStatus or status must be provided',
    }),
});

