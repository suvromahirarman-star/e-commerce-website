import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Public Storefront API Endpoints', () => {
  const app = createApp();

  describe('Products', () => {
    it('GET /api/v1/products should return list of published products with metadata', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('price');
      expect(res.body.data[0]).toHaveProperty('images');
    });

    it('GET /api/v1/products with search should filter by keywords', async () => {
      const res = await request(app).get('/api/v1/products?search=Trench');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name.toLowerCase()).toContain('trench');
    });

    it('GET /api/v1/products/prod-01 should return single product details', async () => {
      const res = await request(app).get('/api/v1/products/prod-01');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('prod-01');
      expect(res.body.data.slug).toBe('soren-oversized-wool-trench-coat');
    });

    it('GET /api/v1/products/slug/soren-oversized-wool-trench-coat should return product by slug', async () => {
      const res = await request(app).get('/api/v1/products/slug/soren-oversized-wool-trench-coat');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('prod-01');
    });

    it('GET /api/v1/products/invalid-id should return 404', async () => {
      const res = await request(app).get('/api/v1/products/non-existent-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Categories', () => {
    it('GET /api/v1/categories should return all active categories with item counts', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('slug');
      expect(res.body.data[0]).toHaveProperty('itemCount');
    });

    it('GET /api/v1/categories/mens should return specific category', async () => {
      const res = await request(app).get('/api/v1/categories/mens');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('mens');
    });
  });

  describe('Coupons Validation', () => {
    it('POST /api/v1/coupons/validate should successfully apply valid coupon', async () => {
      const res = await request(app)
        .post('/api/v1/coupons/validate')
        .send({ code: 'AURA10', subtotal: 5000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.valid).toBe(true);
      expect(res.body.data.discountAmount).toBe(500); // 10% of 5000
    });

    it('POST /api/v1/coupons/validate should reject subtotal below minSpend', async () => {
      const res = await request(app)
        .post('/api/v1/coupons/validate')
        .send({ code: 'AURA10', subtotal: 1000 }); // minSpend is 2000

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Minimum order');
    });

    it('POST /api/v1/coupons/validate should reject non-existent coupon', async () => {
      const res = await request(app)
        .post('/api/v1/coupons/validate')
        .send({ code: 'FAKECODE', subtotal: 5000 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid promo code');
    });
  });

  describe('Reviews', () => {
    it('GET /api/v1/reviews/product/prod-01 should return reviews for product', async () => {
      const res = await request(app).get('/api/v1/reviews/product/prod-01');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].productId).toBe('prod-01');
    });

    it('POST /api/v1/reviews should submit a new verified review', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          productId: 'prod-01',
          author: 'Arman Test',
          rating: 5,
          title: 'Masterpiece coat',
          comment: 'The wool feel is extraordinary and warm.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.author).toBe('Arman Test');
    });
  });

  describe('Homepage CMS & Store Settings', () => {
    it('GET /api/v1/content/homepage should return hero and campaign banners', async () => {
      const res = await request(app).get('/api/v1/content/homepage');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('hero');
      expect(res.body.data).toHaveProperty('announcement');
      expect(res.body.data).toHaveProperty('promotionalBanner');
    });

    it('GET /api/v1/settings should return store settings and shipping info', async () => {
      const res = await request(app).get('/api/v1/settings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.storeName).toBe('AURA Studio');
      expect(res.body.data.freeShippingThreshold).toBe(3000);
    });
  });
});
