import { Router } from 'express';
import { storefrontReviewController } from '../../controllers/storefront/review.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { createReviewSchema } from '../../validators/review.validator.js';

const router = Router();

router.get('/product/:productId', (req, res, next) =>
  storefrontReviewController.getProductReviews(req, res, next)
);
router.post('/', validateRequest(createReviewSchema), (req, res, next) =>
  storefrontReviewController.createReview(req, res, next)
);

export const storefrontReviewRoutes = router;
