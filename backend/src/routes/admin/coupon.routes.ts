import { Router } from 'express';
import { adminCouponController } from '../../controllers/admin/coupon.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createCouponSchema,
  updateCouponSchema,
} from '../../validators/adminOperations.validator.js';

const router = Router();

// GET /api/v1/admin/coupons
router.get('/', (req, res, next) =>
  adminCouponController.getCoupons(req, res, next)
);

// GET /api/v1/admin/coupons/:id
router.get('/:id', (req, res, next) =>
  adminCouponController.getCouponById(req, res, next)
);

// POST /api/v1/admin/coupons
router.post('/', validate(createCouponSchema), (req, res, next) =>
  adminCouponController.createCoupon(req, res, next)
);

// PATCH /api/v1/admin/coupons/:id
router.patch('/:id', validate(updateCouponSchema), (req, res, next) =>
  adminCouponController.updateCoupon(req, res, next)
);

// PATCH /api/v1/admin/coupons/:id/toggle
router.patch('/:id/toggle', (req, res, next) =>
  adminCouponController.toggleCouponStatus(req, res, next)
);

// DELETE /api/v1/admin/coupons/:id
router.delete('/:id', (req, res, next) =>
  adminCouponController.deleteCoupon(req, res, next)
);

export const adminCouponRoutes = router;
