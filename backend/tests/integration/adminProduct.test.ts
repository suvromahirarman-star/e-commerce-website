import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Admin Product & Category Management (CRUD & Images)', () => {
  const app = createApp();
  let authCookie: string[] = [];
  let createdProductId: string = '';
  let createdCategoryId: string = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@aurastudio.com',
        password: 'admin123',
      });
    const cookies = loginRes.headers['set-cookie'];
    authCookie = Array.isArray(cookies) ? cookies : [cookies];
  });

  describe('Authorization Protections', () => {
    it('GET /api/v1/admin/products without credentials should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/products');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/admin/categories without credentials should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/categories');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Product CRUD Operations', () => {
    it('GET /api/v1/admin/products with auth cookie should return all products', async () => {
      const res = await request(app)
        .get('/api/v1/admin/products')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/admin/products should create a new atelier product', async () => {
      const newProductPayload = {
        name: 'Zephyr Silk-Wool Structured Blazer',
        brand: 'AURA Atelier',
        category: "Men's Atelier",
        categorySlug: 'mens',
        price: 9500,
        originalPrice: 11000,
        stock: 14,
        sku: 'AUR-TEST-BLZ-001',
        badge: 'New',
        description: 'Structured blazer tailored from Japanese raw silk and fine merino wool blend.',
        overview: 'Single-breasted architectural cut with soft canvas interlining.',
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
        ],
        colors: [
          { name: 'Onyx Black', hex: '#111111' },
          { name: 'Chalk White', hex: '#F5F5F0' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        specifications: {
          Material: '60% Australian Wool, 40% Mulberry Silk',
          Origin: 'Porto, Portugal',
        },
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isFlashSale: false,
        status: 'published',
      };

      const res = await request(app)
        .post('/api/v1/admin/products')
        .set('Cookie', authCookie)
        .send(newProductPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Zephyr Silk-Wool Structured Blazer');
      expect(res.body.data.price).toBe(9500);
      createdProductId = res.body.data.id;
    });

    it('PATCH /api/v1/admin/products/:id should update existing product fields', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/products/${createdProductId}`)
        .set('Cookie', authCookie)
        .send({
          price: 9900,
          stock: 20,
          badge: 'Editor Pick',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(9900);
      expect(res.body.data.stock).toBe(20);
      expect(res.body.data.badge).toBe('Editor Pick');
    });

    it('POST /api/v1/admin/products/:id/images should upload image buffer', async () => {
      // Mock 1x1 png buffer
      const dummyPng = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      const res = await request(app)
        .post(`/api/v1/admin/products/${createdProductId}/images`)
        .set('Cookie', authCookie)
        .attach('image', dummyPng, 'test-swatch.png');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.image.url).toBeDefined();
    });

    it('PATCH /api/v1/admin/products/:id/images/reorder should update image order', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/products/${createdProductId}/images/reorder`)
        .set('Cookie', authCookie)
        .send({
          imageUrls: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('DELETE /api/v1/admin/products/:id should delete product', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/products/${createdProductId}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/api/v1/products/${createdProductId}`);
      expect(checkRes.status).toBe(404);
    });
  });

  describe('Category Admin Operations', () => {
    it('POST /api/v1/admin/categories should create category', async () => {
      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Cookie', authCookie)
        .send({
          name: 'Ceramics & Homeware',
          tagline: 'Sculptural tableware and functional art.',
          description: 'Hand-thrown stoneware curated for modern living spaces.',
          image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85',
          featured: true,
          displayOrder: 8,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Ceramics & Homeware');
      createdCategoryId = res.body.data.id;
    });

    it('DELETE /api/v1/admin/categories/:id should delete category', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/categories/${createdCategoryId}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
