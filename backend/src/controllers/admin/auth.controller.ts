import { Request, Response, NextFunction } from 'express';
import { authService } from '../../services/auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { env } from '../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export class AdminAuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { admin, accessToken, refreshToken } = await authService.login(email, password);

      // Set HttpOnly Cookies
      res.cookie('aura_access_token', accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('aura_refresh_token', refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ApiResponse.success(res, {
        message: 'Administrator authentication successful',
        data: {
          user: admin,
          token: accessToken,
          expiresIn: '15m',
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.aura_refresh_token || req.body?.refreshToken;
      const { accessToken, refreshToken, admin } = await authService.refreshToken(rawRefreshToken);

      // Update HttpOnly Cookies
      res.cookie('aura_access_token', accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('aura_refresh_token', refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, {
        message: 'Tokens rotated successfully',
        data: {
          user: admin,
          token: accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.aura_refresh_token || req.body?.refreshToken;
      await authService.logout(rawRefreshToken);

      res.clearCookie('aura_access_token', COOKIE_OPTIONS);
      res.clearCookie('aura_refresh_token', COOKIE_OPTIONS);

      return ApiResponse.success(res, {
        message: 'Administrator logged out successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await authService.getMe(req.admin!.id);
      return ApiResponse.success(res, {
        message: 'Profile retrieved successfully',
        data: admin,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminAuthController = new AdminAuthController();
