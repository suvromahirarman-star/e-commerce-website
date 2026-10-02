import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../../services/review.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminReviewController {
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const options = {
        status: req.query.status as string | undefined,
        search: (req.query.search || req.query.q) as string | undefined,
        rating: req.query.rating ? parseInt(req.query.rating as string, 10) : undefined,
      };

      const reviews = await reviewService.getAllReviews(options);
      return ApiResponse.success(res, {
        message: 'Reviews retrieved successfully',
        data: reviews,
        meta: { total: reviews.length },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await reviewService.updateReviewStatus(id as string, status);
      return ApiResponse.success(res, {
        message: `Review marked as ${updated.status}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await reviewService.deleteReview(id as string);
      return ApiResponse.success(res, {
        message: 'Review permanently deleted',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminReviewController = new AdminReviewController();
