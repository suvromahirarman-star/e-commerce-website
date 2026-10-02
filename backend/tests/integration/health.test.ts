import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Health & Diagnostic Endpoints', () => {
  const app = createApp();

  it('GET / should return root welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('AURA Studio Backend API');
    expect(res.body.status).toBe('online');
  });

  it('GET /api/v1/health should return 200 OK with system status and instance details', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
    expect(res.body.data.instance).toBeDefined();
    expect(res.body.data.instance.pid).toBeDefined();
  });

  it('GET /api/v1/non-existent-route should return 404', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
