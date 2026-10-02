import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { adminRepository } from '../repositories/admin.repository.js';
import { AdminRole } from '../types/index.js';

export const authenticateAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.aura_access_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required. No access token provided.');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new UnauthorizedError('Access token is expired or invalid.');
    }

    // Verify admin status in database
    const admin = await adminRepository.findById(decoded.id);
    if (!admin || !admin.is_active) {
      throw new UnauthorizedError('Administrator account not found or has been deactivated.');
    }

    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdminRole = (...allowedRoles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.admin.role)) {
      return next(
        new ForbiddenError(
          `Insufficient permissions. Requires one of: [${allowedRoles.join(', ')}].`
        )
      );
    }

    next();
  };
};
