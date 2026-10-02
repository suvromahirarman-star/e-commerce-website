import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../../services/review.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class StorefrontReviewController {
  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.productId);
      const reviews = await reviewService.getProductReviews(productId);
      return ApiResponse.success(res, {
        message: 'Product reviews retrieved successfully',
        data: reviews,
        meta: { count: reviews.length },
      });
    } catch (err) {
      next(err);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.addReview(req.body);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storefrontReviewController = new StorefrontReviewController();
