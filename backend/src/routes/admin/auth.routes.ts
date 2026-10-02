import { Router } from 'express';
import { adminAuthController } from '../../controllers/admin/auth.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { adminLoginSchema } from '../../validators/auth.validator.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Public auth endpoints with brute-force rate limiter
router.post('/login', authRateLimiter, validateRequest(adminLoginSchema), (req, res, next) =>
  adminAuthController.login(req, res, next)
);

router.post('/refresh', (req, res, next) =>
  adminAuthController.refresh(req, res, next)
);

router.post('/logout', (req, res, next) =>
  adminAuthController.logout(req, res, next)
);

// Protected identity endpoint
router.get('/me', authenticateAdmin, (req, res, next) =>
  adminAuthController.getMe(req, res, next)
);

export const adminAuthRoutes = router;
