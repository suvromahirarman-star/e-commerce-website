import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { memoryStore } from '../../src/database/index.js';

describe('Authoritative Order Engine & Atomic Transactions (Phase 6)', () => {
  const app = createApp();
  let adminAuthCookie: string[] = [];
  let testOrderNumber: string = '';

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

  describe('Guest Checkout & Price / Stock Authority', () => {
    it('POST /api/v1/orders should successfully create a guest order with server-calculated price and coupon', async () => {
      const prod = memoryStore.products.find((p) => p.id === 'prod-01');
      const initialStock = prod?.stock ?? 12;

      const guestOrderPayload = {
        customer: {
          fullName: 'Tanvir Hossain',
          email: 'tanvir.test@example.com',
          phone: '+880 1711 000111',
        },
        shippingAddress: {
          street: 'House 12, Road 4, Sector 3, Uttara',
          city: 'Dhaka',
          division: 'Dhaka',
          postalCode: '1230',
        },
        items: [
          {
            productId: 'prod-01',
            quantity: 2,
            selectedColor: 'Camel Tan',
            selectedSize: 'M',
            price: 1, // Fraudulent frontend price
          },
        ],
        couponCode: 'AURA10', // 10% off
        paymentMethod: 'Cash on Delivery',
      };

      const res = await request(app).post('/api/v1/orders').send(guestOrderPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      const order = res.body.data;
      expect(order).toBeDefined();
      expect(order.orderNumber).toMatch(/^AUR-\d{4}-\d{4}$/);
      testOrderNumber = order.orderNumber;

      // Verify authoritative pricing:
      // prod-01 price is 8900. Quantity 2 => subtotal 17800
      expect(order.pricing.subtotal).toBe(17800);
      expect(order.subtotal).toBe(17800);

      // Verify coupon calculation (10% of 17800 = 1780)
      expect(order.pricing.discount).toBe(1780);
      expect(order.discountAmount).toBe(1780);

      // Verify free delivery (subtotal >= 3000)
      expect(order.pricing.shippingFee).toBe(0);

      // Verify total: 17800 - 1780 + 0 = 16020
      expect(order.pricing.total).toBe(16020);
      expect(order.totalAmount).toBe(16020);

      // Verify stock was decremented atomically by 2
      const updatedProd = memoryStore.products.find((p) => p.id === 'prod-01');
      expect(updatedProd?.stock).toBe(initialStock - 2);

      // Verify customer metrics updated in memoryStore.customers
      const customer = memoryStore.customers.find((c) => c.email === 'tanvir.test@example.com');
      expect(customer).toBeDefined();
      expect(customer.orderCount).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/v1/orders should reject orders when requested quantity exceeds available stock (409 Conflict)', async () => {
      const orderPayload = {
        customer: {
          fullName: 'Overbuyer Patron',
          email: 'overbuyer@example.com',
          phone: '+880 1811 999888',
        },
        shippingAddress: {
          street: 'Test Road',
          city: 'Dhaka',
        },
        items: [
          {
            productId: 'prod-01',
            quantity: 9999,
          },
        ],
        paymentMethod: 'Cash on Delivery',
      };

      const res = await request(app).post('/api/v1/orders').send(orderPayload);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Insufficient stock');
    });

    it('POST /api/v1/orders should reject invalid or expired coupon code (400 Bad Request)', async () => {
      const orderPayload = {
        customer: {
          fullName: 'Coupon Tester',
          email: 'coupon.tester@example.com',
          phone: '+880 1911 333444',
        },
        shippingAddress: {
          street: 'Test Road',
          city: 'Dhaka',
        },
        items: [
          {
            productId: 'prod-02',
            quantity: 1,
          },
        ],
        couponCode: 'INVALID_COUPON_CODE_999',
        paymentMethod: 'Cash on Delivery',
      };

      const res = await request(app).post('/api/v1/orders').send(orderPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('invalid');
    });
  });

  describe('Public Order Tracking', () => {
    it('GET /api/v1/orders/:orderNumber should return order details for the customer', async () => {
      expect(testOrderNumber).toBeTruthy();

      const res = await request(app).get(`/api/v1/orders/${testOrderNumber}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBe(testOrderNumber);
      expect(res.body.data.customer.fullName).toBe('Tanvir Hossain');
      expect(res.body.data.items.length).toBe(1);
    });

    it('GET /api/v1/orders/:orderNumber should return 404 for unknown order number', async () => {
      const res = await request(app).get('/api/v1/orders/AUR-2099-0000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Order Fulfillment Pipeline', () => {
    it('GET /api/v1/admin/orders without auth should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/orders');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/admin/orders with admin auth should return list of orders with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/admin/orders')
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta.total).toBeGreaterThan(0);
    });

    it('GET /api/v1/admin/orders with search filter should filter by customer name or order number', async () => {
      const res = await request(app)
        .get(`/api/v1/admin/orders?search=${encodeURIComponent('Tanvir Hossain')}`)
        .set('Cookie', adminAuthCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].customer.fullName).toBe('Tanvir Hossain');
    });

    it('PATCH /api/v1/admin/orders/:id/status should update order fulfillment status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderNumber}/status`)
        .set('Cookie', adminAuthCookie)
        .send({
          orderStatus: 'Shipped',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderStatus).toBe('Shipped');
    });

    it('PATCH /api/v1/admin/orders/:id/status to Cancelled should restore product stock', async () => {
      const prod = memoryStore.products.find((p) => p.id === 'prod-01');
      const stockBeforeCancellation = prod?.stock ?? 10;

      const res = await request(app)
        .patch(`/api/v1/admin/orders/${testOrderNumber}/status`)
        .set('Cookie', adminAuthCookie)
        .send({
          orderStatus: 'Cancelled',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.orderStatus).toBe('Cancelled');

      const updatedProd = memoryStore.products.find((p) => p.id === 'prod-01');
      expect(updatedProd?.stock).toBe(stockBeforeCancellation + 2);
    });
  });
});

