/**
 * Category Service (API-Ready Abstraction Layer)
 */

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

function saveStoredCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
}

export const categoryService = {
  async getCategories() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return getStoredCategories();
  },

  async getCategoryBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const categories = getStoredCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  async createCategory(categoryData) {
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
    const updated = [...categories, newCategory];
    saveStoredCategories(updated);
    return newCategory;
  },

  async updateCategory(id, updatedFields) {
    const categories = getStoredCategories();
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    saveStoredCategories(updated);
    return updated.find((c) => c.id === id);
  },

  async deleteCategory(id) {
    const categories = getStoredCategories();
    const updated = categories.filter((c) => c.id !== id);
    saveStoredCategories(updated);
    return true;
  },
};
