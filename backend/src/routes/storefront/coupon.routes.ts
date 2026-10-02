import { Router } from 'express';
import { storefrontCouponController } from '../../controllers/storefront/coupon.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { validateCouponSchema } from '../../validators/coupon.validator.js';

const router = Router();

router.post('/validate', validateRequest(validateCouponSchema), (req, res, next) =>
  storefrontCouponController.validateCoupon(req, res, next)
);

export const storefrontCouponRoutes = router;
