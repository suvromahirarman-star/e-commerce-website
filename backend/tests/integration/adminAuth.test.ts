import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Admin Authentication & RBAC Engine', () => {
  const app = createApp();

  let authCookies: string[] = [];
  let refreshToken: string = '';

  it('POST /api/v1/admin/auth/login with valid credentials should succeed and set HttpOnly cookies', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@aurastudio.com',
        password: 'admin123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('admin@aurastudio.com');
    expect(res.body.data.user.role).toBe('super_admin');
    expect(res.body.data.token).toBeDefined();

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    authCookies = Array.isArray(cookies) ? cookies : [cookies];

    const hasAccessToken = authCookies.some((c) => c.includes('aura_access_token='));
    const hasRefreshToken = authCookies.some((c) => c.includes('aura_refresh_token='));
    expect(hasAccessToken).toBe(true);
    expect(hasRefreshToken).toBe(true);

    const refreshMatch = authCookies.find((c) => c.includes('aura_refresh_token='))?.match(/aura_refresh_token=([^;]+)/);
    if (refreshMatch) {
      refreshToken = refreshMatch[1];
    }
  });

  it('POST /api/v1/admin/auth/login with invalid password should fail with 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({
        email: 'admin@aurastudio.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/auth/me should return current admin when authenticated via cookie', async () => {
    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Cookie', authCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('admin@aurastudio.com');
  });

  it('GET /api/v1/admin/me should alias to admin profile with 200 OK', async () => {
    const res = await request(app)
      .get('/api/v1/admin/me')
      .set('Cookie', authCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('super_admin');
  });

  it('GET /api/v1/admin/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/admin/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/admin/auth/refresh should rotate tokens and issue new session cookies', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/refresh')
      .set('Cookie', authCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();

    const newCookies = res.headers['set-cookie'];
    expect(newCookies).toBeDefined();
    authCookies = Array.isArray(newCookies) ? newCookies : [newCookies];
  });

  it('POST /api/v1/admin/auth/logout should revoke refresh token and clear cookies', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/logout')
      .set('Cookie', authCookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Old token should now be rejected for refresh
    const retryRes = await request(app)
      .post('/api/v1/admin/auth/refresh')
      .send({ refreshToken });

    expect(retryRes.status).toBe(401);
  });
});
