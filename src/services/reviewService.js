/**
 * Review Service (API-Ready Abstraction Layer)
 */

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

function saveStoredReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews to localStorage:', e);
  }
}

export const reviewService = {
  async getReviewsByProductId(productId) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const reviews = getStoredReviews();
    return reviews.filter((r) => r.productId === productId);
  },

  async getAllReviews() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getStoredReviews();
  },

  async addReview(reviewData) {
    const reviews = getStoredReviews();
    const newReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      verified: true,
      status: 'Approved',
    };
    const updated = [newReview, ...reviews];
    saveStoredReviews(updated);
    return newReview;
  },

  async updateReviewStatus(id, status) {
    const reviews = getStoredReviews();
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    saveStoredReviews(updated);
    return updated.find((r) => r.id === id);
  },

  async deleteReview(id) {
    const reviews = getStoredReviews();
    const updated = reviews.filter((r) => r.id !== id);
    saveStoredReviews(updated);
    return true;
  },
};
