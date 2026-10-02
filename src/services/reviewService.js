/**
 * Review Service (API-Connected Layer)
 */

import { apiClient } from './apiClient';
import { mockReviews } from '../data/mockReviews';

const STORAGE_KEY = 'aura_custom_reviews';

function getStoredReviews() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockReviews;
    const parsed = JSON.parse(custom);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockReviews;
  } catch (e) {
    return mockReviews;
  }
}

export const reviewService = {
  async getReviewsByProductId(productId) {
    try {
      const res = await apiClient.get(`/reviews/product/${productId}`);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      const reviews = getStoredReviews();
      return reviews.filter((r) => r.productId === productId);
    }
  },

  async getAllReviews(options = {}) {
    try {
      const res = await apiClient.get('/admin/reviews', options);
      return Array.isArray(res) ? res : [];
    } catch (err) {
      return getStoredReviews();
    }
  },

  async addReview(reviewData) {
    try {
      return await apiClient.post('/reviews', reviewData);
    } catch (err) {
      const reviews = getStoredReviews();
      const newReview = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        verified: true,
        status: 'Approved',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newReview, ...reviews]));
      return newReview;
    }
  },

  async updateReviewStatus(id, status) {
    try {
      return await apiClient.patch(`/admin/reviews/${id}/status`, { status });
    } catch (err) {
      const reviews = getStoredReviews();
      const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((r) => r.id === id);
    }
  },

  async deleteReview(id) {
    try {
      await apiClient.delete(`/admin/reviews/${id}`);
      return true;
    } catch (err) {
      const reviews = getStoredReviews();
      const updated = reviews.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  },
};
