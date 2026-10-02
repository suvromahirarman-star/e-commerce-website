import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Security & Robustness Verification', () => {
  const app = createApp();

  describe('Security Headers & Middleware', () => {
    it('Response should include Helmet security headers', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-frame-options');
    });

    it('Response should include CORS headers for allowed origins', async () => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Error Handling & Boundary Protection', () => {
    it('Undefined API routes should return structured 404 JSON', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('API endpoint not found');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('Malformed JSON in request body should return 400 with structured error', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Content-Type', 'application/json')
        .send('{"customer": invalid_json_here}');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('Validation errors should return descriptive field issues', async () => {
      const res = await request(app).post('/api/v1/orders').send({
        customer: {
          fullName: '', // empty name
          email: 'not-an-email', // invalid email
          phone: '',
        },
        items: [], // empty items array
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation error');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });
});
