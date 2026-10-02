import bcrypt from 'bcryptjs';
import { adminRepository } from '../repositories/admin.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/token.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { AdminPayload } from '../types/index.js';

export class AuthService {
  async login(email: string, password: string) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!admin.is_active) {
      throw new ForbiddenError('This administrator account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: AdminPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store hashed refresh token in database (7 days expiration)
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await adminRepository.storeRefreshToken(admin.id, tokenHash, expiresAt);

    return {
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const decoded = verifyRefreshToken(rawRefreshToken);
    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await adminRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found or already invalidated');
    }

    if (storedToken.revoked_at) {
      // Possible token reuse attempt! Revoke all tokens for this admin
      await adminRepository.revokeAllAdminTokens(decoded.id);
      throw new UnauthorizedError('Compromised refresh token detected. Please login again.');
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const admin = await adminRepository.findById(decoded.id);
    if (!admin || !admin.is_active) {
      throw new UnauthorizedError('Administrator account inactive or not found');
    }

    // ROTATE: Revoke old token
    await adminRepository.revokeRefreshToken(tokenHash);

    // Issue new token pair
    const payload: AdminPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await adminRepository.storeRefreshToken(admin.id, newTokenHash, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await adminRepository.revokeRefreshToken(tokenHash);
    }
    return true;
  }

  async getMe(adminId: string) {
    const admin = await adminRepository.findById(adminId);
    if (!admin || !admin.is_active) {
      throw new UnauthorizedError('Administrator not found or inactive');
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
  }
}

export const authService = new AuthService();
