import { Router } from 'express';
import { adminDashboardController } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

// GET /api/v1/admin/dashboard/stats
router.get('/stats', (req, res, next) =>
  adminDashboardController.getStats(req, res, next)
);

// GET /api/v1/admin/dashboard
router.get('/', (req, res, next) =>
  adminDashboardController.getStats(req, res, next)
);

export const adminDashboardRoutes = router;
