import { dbQuery, memoryStore, getIsPgConnected } from '../database/index.js';

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RefreshTokenRecord {
  id: string;
  admin_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminRecord | null> {
    const cleanEmail = email.trim().toLowerCase();

    if (getIsPgConnected()) {
      const rows = await dbQuery<AdminRecord>(
        `SELECT * FROM admins WHERE LOWER(email) = $1`,
        [cleanEmail]
      );
      return rows[0] || null;
    }

    const found = memoryStore.admins.find(
      (a) => a.email.toLowerCase() === cleanEmail
    );
    return found ? { ...found } : null;
  }

  async findById(id: string): Promise<AdminRecord | null> {
    if (getIsPgConnected()) {
      const rows = await dbQuery<AdminRecord>(
        `SELECT * FROM admins WHERE id = $1`,
        [id]
      );
      return rows[0] || null;
    }

    const found = memoryStore.admins.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async storeRefreshToken(adminId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    if (getIsPgConnected()) {
      await dbQuery(
        `INSERT INTO admin_refresh_tokens (admin_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [adminId, tokenHash, expiresAt.toISOString()]
      );
      return;
    }

    memoryStore.refreshTokens.push({
      id: `tok-${Date.now()}-${Math.random()}`,
      admin_id: adminId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      revoked_at: null,
      created_at: new Date().toISOString(),
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    if (getIsPgConnected()) {
      const rows = await dbQuery<RefreshTokenRecord>(
        `SELECT * FROM admin_refresh_tokens WHERE token_hash = $1`,
        [tokenHash]
      );
      return rows[0] || null;
    }

    const found = memoryStore.refreshTokens.find((t) => t.token_hash === tokenHash);
    return found ? { ...found } : null;
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    if (getIsPgConnected()) {
      await dbQuery(
        `UPDATE admin_refresh_tokens
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE token_hash = $1`,
        [tokenHash]
      );
      return;
    }

    const token = memoryStore.refreshTokens.find((t) => t.token_hash === tokenHash);
    if (token) {
      token.revoked_at = new Date().toISOString();
    }
  }

  async revokeAllAdminTokens(adminId: string): Promise<void> {
    if (getIsPgConnected()) {
      await dbQuery(
        `UPDATE admin_refresh_tokens
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE admin_id = $1 AND revoked_at IS NULL`,
        [adminId]
      );
      return;
    }

    memoryStore.refreshTokens.forEach((t) => {
      if (t.admin_id === adminId && !t.revoked_at) {
        t.revoked_at = new Date().toISOString();
      }
    });
  }
}

export const adminRepository = new AdminRepository();
