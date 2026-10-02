import { reviewRepository, ReviewRecord } from '../repositories/review.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export class ReviewService {
  /**
   * Public: Get approved reviews for a specific product
   */
  async getProductReviews(productId: string): Promise<ReviewRecord[]> {
    return await reviewRepository.findByProductId(productId, true);
  }

  /**
   * Public: Submit a review
   */
  async addReview(data: {
    productId: string;
    author: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<ReviewRecord> {
    if (!data.productId) {
      throw new BadRequestError('Product ID is required for review');
    }

    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new BadRequestError(`Cannot review non-existent product: ${data.productId}`);
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestError('Rating must be an integer between 1 and 5');
    }

    const createdReview = await reviewRepository.create(data);

    // Recompute product average rating & review count
    const approvedReviews = await reviewRepository.findByProductId(data.productId, true);
    if (approvedReviews.length > 0) {
      const avgRating =
        approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
      product.rating = Math.round(avgRating * 10) / 10;
      product.reviewCount = approvedReviews.length;
    }

    return createdReview;
  }

  /**
   * Admin: Get all reviews with status/search/rating filters
   */
  async getAllReviews(options: {
    status?: string;
    search?: string;
    rating?: number;
  } = {}): Promise<ReviewRecord[]> {
    return await reviewRepository.findAll(options);
  }

  /**
   * Admin: Update review moderation status
   */
  async updateReviewStatus(
    id: string,
    newStatus: string
  ): Promise<ReviewRecord> {
    const valid = ['Pending', 'Approved', 'Rejected'];
    const matched = valid.find((v) => v.toLowerCase() === newStatus.toLowerCase());
    if (!matched) {
      throw new BadRequestError(
        `Invalid review status "${newStatus}". Must be one of: ${valid.join(', ')}`
      );
    }

    const updated = await reviewRepository.updateStatus(id, matched as any);

    // Recalculate product rating & review count for the affected product
    if (updated.productId) {
      const approvedReviews = await reviewRepository.findByProductId(updated.productId, true);
      const prod = await productRepository.findById(updated.productId);
      if (prod) {
        if (approvedReviews.length > 0) {
          const avgRating =
            approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
          prod.rating = Math.round(avgRating * 10) / 10;
          prod.reviewCount = approvedReviews.length;
        } else {
          prod.rating = 5.0;
          prod.reviewCount = 0;
        }
      }
    }

    return updated;
  }

  /**
   * Admin: Delete review
   */
  async deleteReview(id: string): Promise<boolean> {
    const existing = await reviewRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Review with ID "${id}" not found`);
    }

    const deleted = await reviewRepository.delete(id);

    // Recalculate product rating
    if (existing.productId) {
      const approvedReviews = await reviewRepository.findByProductId(existing.productId, true);
      const prod = await productRepository.findById(existing.productId);
      if (prod) {
        if (approvedReviews.length > 0) {
          const avgRating =
            approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
          prod.rating = Math.round(avgRating * 10) / 10;
          prod.reviewCount = approvedReviews.length;
        } else {
          prod.rating = 5.0;
          prod.reviewCount = 0;
        }
      }
    }

    return deleted;
  }
}

export const reviewService = new ReviewService();
