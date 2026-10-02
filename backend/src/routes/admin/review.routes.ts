import { Router } from 'express';
import { adminReviewController } from '../../controllers/admin/review.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateReviewStatusSchema } from '../../validators/adminOperations.validator.js';

const router = Router();

// GET /api/v1/admin/reviews
router.get('/', (req, res, next) =>
  adminReviewController.getReviews(req, res, next)
);

// PATCH /api/v1/admin/reviews/:id/status
router.patch('/:id/status', validate(updateReviewStatusSchema), (req, res, next) =>
  adminReviewController.updateStatus(req, res, next)
);

// PATCH /api/v1/admin/reviews/:id
router.patch('/:id', validate(updateReviewStatusSchema), (req, res, next) =>
  adminReviewController.updateStatus(req, res, next)
);

// DELETE /api/v1/admin/reviews/:id
router.delete('/:id', (req, res, next) =>
  adminReviewController.deleteReview(req, res, next)
);

export const adminReviewRoutes = router;
