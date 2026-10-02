/**
 * Category Service (API-Connected Layer)
 */

import { apiClient } from './apiClient';
import { mockCategories } from '../data/mockCategories';

const STORAGE_KEY = 'aura_custom_categories';

function getStoredCategories() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockCategories;
    const parsed = JSON.parse(custom);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockCategories;
  } catch (e) {
    return mockCategories;
  }
}

export const categoryService = {
  async getCategories() {
    try {
      const categories = await apiClient.get('/categories');
      return Array.isArray(categories) ? categories : getStoredCategories();
    } catch (err) {
      return getStoredCategories();
    }
  },

  async getCategoryBySlug(slug) {
    try {
      return await apiClient.get(`/categories/${slug}`);
    } catch (err) {
      const categories = getStoredCategories();
      return categories.find((c) => c.slug === slug) || null;
    }
  },

  async createCategory(categoryData) {
    try {
      return await apiClient.post('/admin/categories', categoryData);
    } catch (err) {
      const categories = getStoredCategories();
      const newCategory = {
        ...categoryData,
        id: `cat-${Date.now()}`,
        slug: (categoryData.name || 'category')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        itemCount: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...categories, newCategory]));
      return newCategory;
    }
  },

  async updateCategory(id, updatedFields) {
    try {
      return await apiClient.patch(`/admin/categories/${id}`, updatedFields);
    } catch (err) {
      const categories = getStoredCategories();
      const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((c) => c.id === id);
    }
  },

  async deleteCategory(id) {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      return true;
    } catch (err) {
      const categories = getStoredCategories();
      const updated = categories.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  },
};
