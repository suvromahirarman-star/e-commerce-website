import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { storefrontProductRoutes } from './storefront/product.routes.js';
import { storefrontCategoryRoutes } from './storefront/category.routes.js';
import { storefrontCouponRoutes } from './storefront/coupon.routes.js';
import { storefrontReviewRoutes } from './storefront/review.routes.js';
import { storefrontOrderRoutes } from './storefront/order.routes.js';
import { storefrontCmsRoutes } from './storefront/cms.routes.js';
import { storefrontCmsController } from '../controllers/storefront/cms.controller.js';

import { adminAuthRoutes } from './admin/auth.routes.js';
import { adminAuthController } from '../controllers/admin/auth.controller.js';
import { adminProductRoutes } from './admin/product.routes.js';
import { adminCategoryRoutes } from './admin/category.routes.js';
import { adminOrderRoutes } from './admin/order.routes.js';
import { adminInventoryRoutes } from './admin/inventory.routes.js';
import { adminCustomerRoutes } from './admin/customer.routes.js';
import { adminCouponRoutes } from './admin/coupon.routes.js';
import { adminReviewRoutes } from './admin/review.routes.js';
import { adminDashboardRoutes } from './admin/dashboard.routes.js';
import { adminDashboardController } from '../controllers/admin/dashboard.controller.js';
import { adminCmsController } from '../controllers/admin/cms.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Diagnostics & Health
router.use('/', healthRoutes);

// Public Storefront Endpoints
router.use('/products', storefrontProductRoutes);
router.use('/categories', storefrontCategoryRoutes);
router.use('/coupons', storefrontCouponRoutes);
router.use('/reviews', storefrontReviewRoutes);
router.use('/orders', storefrontOrderRoutes);
router.use('/content', storefrontCmsRoutes);
router.get('/settings', (req, res, next) =>
  storefrontCmsController.getStoreSettings(req, res, next)
);

// Admin Authentication Endpoints
router.use('/admin/auth', adminAuthRoutes);
router.get('/admin/me', authenticateAdmin, (req, res, next) =>
  adminAuthController.getMe(req, res, next)
);

// Protected Admin Management Endpoints
router.use('/admin/products', authenticateAdmin, adminProductRoutes);
router.use('/admin/categories', authenticateAdmin, adminCategoryRoutes);
router.use('/admin/orders', authenticateAdmin, adminOrderRoutes);
router.use('/admin/inventory', authenticateAdmin, adminInventoryRoutes);
router.use('/admin/customers', authenticateAdmin, adminCustomerRoutes);
router.use('/admin/coupons', authenticateAdmin, adminCouponRoutes);
router.use('/admin/reviews', authenticateAdmin, adminReviewRoutes);
router.use('/admin/dashboard', authenticateAdmin, adminDashboardRoutes);
router.get('/admin/stats', authenticateAdmin, (req, res, next) =>
  adminDashboardController.getStats(req, res, next)
);

// Admin CMS & Store Settings Endpoints
router.get('/admin/content/homepage', authenticateAdmin, (req, res, next) =>
  adminCmsController.getHomepageContent(req, res, next)
);
router.put('/admin/content/homepage', authenticateAdmin, (req, res, next) =>
  adminCmsController.updateHomepageContent(req, res, next)
);
router.get('/admin/settings', authenticateAdmin, (req, res, next) =>
  adminCmsController.getStoreSettings(req, res, next)
);
router.put('/admin/settings', authenticateAdmin, (req, res, next) =>
  adminCmsController.updateStoreSettings(req, res, next)
);

export const apiRouter = router;