import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { memoryStore } from '../../src/database/index.js';

describe('Phase 9: Comprehensive End-to-End Verification (Storefront & Admin Lifecycle)', () => {
  const app = createApp();
  let adminCookie: string[] = [];
  let generatedOrderNumber = '';
  let testProductId = 'prod-01';
  let initialStock = 0;

  beforeAll(async () => {
    // 1. Authenticate as Admin
    const loginRes = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@aurastudio.com',
        password: 'admin123',
      });
    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers['set-cookie'];
    adminCookie = Array.isArray(cookies) ? cookies : [cookies];

    const prod = memoryStore.products.find((p) => p.id === testProductId);
    initialStock = prod?.stock ?? 12;
  });

  describe('Journey 1: Guest Customer Frictionless Checkout & Order Lifecycle', () => {
    it('Step 1: Customer discovers products in the public catalog', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .query({ category: "women's collection", sort: 'price-low-to-high' });

      expect(res.status).toBe(200);
      const products = res.body.data.products || res.body.data;
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('Step 2: Customer views product details by unique slug', async () => {
      const res = await request(app).get(
        '/api/v1/products/slug/elysian-sculpted-cashmere-turtleneck'
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('elysian-sculpted-cashmere-turtleneck');
      expect(res.body.data.price).toBeGreaterThan(0);
    });

    it('Step 3: Customer validates promotional voucher code during checkout', async () => {
      const res = await request(app)
        .post('/api/v1/coupons/validate')
        .send({ code: 'AURA10', subtotal: 10000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.valid).toBe(true);
      expect(res.body.data.discountAmount).toBe(1000); // 10% of 10000
    });

    it('Step 4: Customer places frictionless guest order with authoritative pricing', async () => {
      const checkoutPayload = {
        customer: {
          fullName: 'Ayesha Siddiqua',
          email: 'ayesha.siddiqua@example.com',
          phone: '+880 1711 888999',
        },
        shippingAddress: {
          street: 'House 8, Road 2, Block B, Dhanmondi',
          city: 'Dhaka',
          division: 'Dhaka',
          postalCode: '1205',
          notes: 'Deliver before 5 PM please',
        },
        items: [
          {
            productId: testProductId,
            quantity: 1,
            selectedColor: 'Camel Tan',
            selectedSize: 'M',
            price: 5, // Client sends invalid tampered price
          },
        ],
        couponCode: 'AURA10',
        paymentMethod: 'Cash on Delivery',
      };

      const res = await request(app).post('/api/v1/orders').send(checkoutPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const order = res.body.data;

      expect(order).toHaveProperty('orderNumber');
      generatedOrderNumber = order.orderNumber;

      // Authoritative pricing: prod-01 price is 8900
      expect(order.subtotal).toBe(8900);
      // Coupon: 10% of 8900 = 890
      expect(order.discountAmount).toBe(890);
      // Free delivery on orders over 3000
      expect(order.deliveryFee).toBe(0);
      // Final total: 8900 - 890 = 8010
      expect(order.totalAmount).toBe(8010);
      expect(order.total).toBe(8010);

      // Verify stock was reduced atomically
      const updatedProd = memoryStore.products.find((p) => p.id === testProductId);
      expect(updatedProd?.stock).toBe(initialStock - 1);
    });

    it('Step 5: Customer tracks their order by order reference number', async () => {
      expect(generatedOrderNumber).toBeTruthy();
      const res = await request(app).get(`/api/v1/orders/${generatedOrderNumber}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBe(generatedOrderNumber);
      expect(res.body.data.customer.fullName).toBe('Ayesha Siddiqua');
      expect(res.body.data.orderStatus).toBe('Pending');
    });

    it('Step 6: Customer submits a verified product review', async () => {
      const res = await request(app).post('/api/v1/reviews').send({
        productId: testProductId,
        author: 'Ayesha Siddiqua',
        rating: 5,
        title: 'Exquisite Wool Drapery',
        comment: 'The quality of the merino wool and craftsmanship is beyond words.',
      });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
    });
  });

  describe('Journey 2: Admin Operations, Moderation & Order Fulfillment Pipeline', () => {
    it('Step 1: Admin verifies authenticated identity session', async () => {
      const res = await request(app).get('/api/v1/admin/me').set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('admin@aurastudio.com');
      expect(res.body.data.role).toBe('super_admin');
    });

    it('Step 2: Admin reviews real-time dashboard analytics & KPIs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.kpis.totalRevenue).toBeGreaterThan(0);
      expect(res.body.data.kpis.totalOrders).toBeGreaterThan(0);
      expect(res.body.data.salesTrend.length).toBe(7);
    });

    it('Step 3: Admin locates the customer order in the fulfillment pipeline', async () => {
      const res = await request(app)
        .get('/api/v1/admin/orders')
        .query({ search: generatedOrderNumber })
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].orderNumber).toBe(generatedOrderNumber);
    });

    it('Step 4: Admin updates order status to Processing, then Shipped', async () => {
      const processRes = await request(app)
        .patch(`/api/v1/admin/orders/${generatedOrderNumber}/status`)
        .set('Cookie', adminCookie)
        .send({ orderStatus: 'Processing' });
      expect(processRes.status).toBe(200);
      expect(processRes.body.data.orderStatus).toBe('Processing');

      const shipRes = await request(app)
        .patch(`/api/v1/admin/orders/${generatedOrderNumber}/status`)
        .set('Cookie', adminCookie)
        .send({ orderStatus: 'Shipped' });
      expect(shipRes.status).toBe(200);
      expect(shipRes.body.data.orderStatus).toBe('Shipped');
    });

    it('Step 5: Admin inspects guest patron directory and finds aggregated customer metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers')
        .query({ search: 'Ayesha' })
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);

      const customer = res.body.data[0];
      expect(customer.fullName).toBe('Ayesha Siddiqua');
      expect(customer.orderCount).toBeGreaterThanOrEqual(1);
      expect(customer.totalSpent).toBeGreaterThanOrEqual(8010);
    });

    it('Step 6: Admin updates stock inventory level for replenishment', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/inventory/${testProductId}`)
        .set('Cookie', adminCookie)
        .send({ stock: 30 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stock).toBe(30);
    });

    it('Step 7: Admin inspects and moderates customer reviews', async () => {
      const res = await request(app)
        .get('/api/v1/admin/reviews')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('Step 8: Admin updates store settings and CMS hero banner', async () => {
      const cmsRes = await request(app)
        .put('/api/v1/admin/content/homepage')
        .set('Cookie', adminCookie)
        .send({
          hero: {
            headline: 'Autumn / Winter 2026 Architectural Elegance',
            supportingCopy: 'Refined merino wool and tailored luxury.',
          },
        });
      expect(cmsRes.status).toBe(200);

      const settingsRes = await request(app)
        .put('/api/v1/admin/settings')
        .set('Cookie', adminCookie)
        .send({
          insideDhakaShipping: 60,
          outsideDhakaShipping: 120,
        });
      expect(settingsRes.status).toBe(200);
    });

    it('Step 9: Admin logs out and verifies session termination', async () => {
      const logoutRes = await request(app)
        .post('/api/v1/admin/auth/logout')
        .set('Cookie', adminCookie);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Verify that subsequent protected request fails with 401
      const meRes = await request(app)
        .get('/api/v1/admin/me')
        .set('Cookie', logoutRes.headers['set-cookie'] || []);

      expect(meRes.status).toBe(401);
    });
  });
});
