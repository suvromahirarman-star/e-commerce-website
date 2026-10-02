import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Phase 7: Inventory, Customer Analytics & Moderation', () => {
  const app = createApp();
  let adminAuthCookie: string[] = [];
  let testCouponId: string = '';
  let testReviewId: string = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@aurastudio.com',
        password: 'admin123',
      });
    const cookies = loginRes.headers['set-cookie'];
    adminAuthCookie = Array.isArray(cookies) ? cookies : [cookies];
  });

  describe('1. Inventory Tracking & Replenishment', () => {
    it('GET /api/v1/admin/inventory without auth should return 401', async () => {
      const res = await request(app).get('/api/v1/admin/inventory');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/admin/inventory with auth should return inventory tracking items', async () => {
      const res = await request(app)
        .get('/api/v1/admin/inventory')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const item = res.body.data[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('stock');
      expect(item).toHaveProperty('status');
      expect(['In Stock', 'Low Stock', 'Out of Stock']).toContain(item.status);
    });

    it('PATCH /api/v1/admin/inventory/:id should adjust stock quantity', async () => {
      const res = await request(app)
        .patch('/api/v1/admin/inventory/prod-01')
        .set('Cookie', adminAuthCookie)
        .send({ stock: 25 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stock).toBe(25);
    });

    it('PATCH /api/v1/admin/inventory/:id should reject negative stock (400 Bad Request)', async () => {
      const res = await request(app)
        .patch('/api/v1/admin/inventory/prod-01')
        .set('Cookie', adminAuthCookie)
        .send({ stock: -5 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Guest Patrons Directory & Customer Analytics', () => {
    it('GET /api/v1/admin/customers without auth should return 401', async () => {
      const res = await request(app).get('/api/v1/admin/customers');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/admin/customers with auth should return patron profiles derived from orders', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const patron = res.body.data[0];
      expect(patron).toHaveProperty('fullName');
      expect(patron).toHaveProperty('email');
      expect(patron).toHaveProperty('orderCount');
      expect(patron).toHaveProperty('totalSpent');
    });

    it('GET /api/v1/admin/customers with search query should filter directory', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers?search=Tariq')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].fullName).toContain('Tariq');
    });
  });

  describe('3. Coupon & Voucher Management', () => {
    it('GET /api/v1/admin/coupons should list all coupons', async () => {
      const res = await request(app)
        .get('/api/v1/admin/coupons')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/admin/coupons should create a new promotional voucher', async () => {
      const newCoupon = {
        code: `WINTER${Date.now().toString().slice(-4)}`,
        type: 'percentage',
        value: 20,
        minSpend: 4000,
        expiryDate: '2026-12-31',
        usageLimit: 300,
        active: true,
      };

      const res = await request(app)
        .post('/api/v1/admin/coupons')
        .set('Cookie', adminAuthCookie)
        .send(newCoupon);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe(newCoupon.code);
      testCouponId = res.body.data.id;
    });

    it('PATCH /api/v1/admin/coupons/:id/toggle should flip active status', async () => {
      expect(testCouponId).toBeTruthy();

      const res = await request(app)
        .patch(`/api/v1/admin/coupons/${testCouponId}/toggle`)
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.active).toBe(false);
    });

    it('DELETE /api/v1/admin/coupons/:id should remove the coupon', async () => {
      expect(testCouponId).toBeTruthy();

      const res = await request(app)
        .delete(`/api/v1/admin/coupons/${testCouponId}`)
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Review Submission & Moderation Pipeline', () => {
    it('POST /api/v1/reviews should submit a customer review', async () => {
      const reviewPayload = {
        productId: 'prod-01',
        author: 'Arham Chowdhury',
        rating: 5,
        title: 'Masterpiece of modern tailoring',
        comment: 'The drape and silhouette of this coat are utterly pristine.',
      };

      const res = await request(app).post('/api/v1/reviews').send(reviewPayload);
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      testReviewId = res.body.data.id;
    });

    it('GET /api/v1/admin/reviews should return all reviews for moderation', async () => {
      const res = await request(app)
        .get('/api/v1/admin/reviews')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('PATCH /api/v1/admin/reviews/:id/status should update review status', async () => {
      expect(testReviewId).toBeTruthy();

      const res = await request(app)
        .patch(`/api/v1/admin/reviews/${testReviewId}/status`)
        .set('Cookie', adminAuthCookie)
        .send({ status: 'Approved' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Approved');
    });

    it('DELETE /api/v1/admin/reviews/:id should delete review', async () => {
      expect(testReviewId).toBeTruthy();

      const res = await request(app)
        .delete(`/api/v1/admin/reviews/${testReviewId}`)
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Operational Dashboard & Analytics', () => {
    it('GET /api/v1/admin/dashboard/stats without auth should return 401', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard/stats');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/admin/dashboard/stats with auth should return complete KPI bundle', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const stats = res.body.data;
      expect(stats).toHaveProperty('kpis');
      expect(stats.kpis).toHaveProperty('totalRevenue');
      expect(stats.kpis).toHaveProperty('totalOrders');
      expect(stats.kpis).toHaveProperty('totalProducts');
      expect(stats.kpis).toHaveProperty('totalCustomers');

      expect(stats).toHaveProperty('salesTrend');
      expect(stats).toHaveProperty('orderStatusBreakdown');
      expect(stats).toHaveProperty('categoryBreakdown');
      expect(stats).toHaveProperty('recentOrders');
      expect(stats).toHaveProperty('lowStockProducts');
    });
  });
});
