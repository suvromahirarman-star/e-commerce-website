/**
 * Product Service (API-Connected Layer)
 * Communicates with Express 5 / PostgreSQL backend with mock fallback resiliency.
 */

import { apiClient } from './apiClient';
import { mockProducts } from '../data/mockProducts';

const STORAGE_KEY = 'aura_custom_products';

function getStoredProducts() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockProducts;
    const parsed = JSON.parse(custom);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockProducts;
  } catch (e) {
    return mockProducts;
  }
}

export const productService = {
  /**
   * Fetch products with optional filtering and sorting
   */
  async getProducts(filters = {}) {
    try {
      const params = {};
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.size) params.size = filters.size;
      if (filters.color) params.color = filters.color;
      if (filters.inStockOnly) params.inStock = true;
      if (filters.discountOnly) params.discountOnly = true;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) {
        if (filters.sortBy === 'price-low-to-high') params.sort = 'price-asc';
        else if (filters.sortBy === 'price-high-to-low') params.sort = 'price-desc';
        else if (filters.sortBy === 'highest-rated') params.sort = 'rating';
        else if (filters.sortBy === 'most-popular') params.sort = 'popular';
        else params.sort = 'newest';
      }

      const res = await apiClient.get('/products', params);
      const items = res?.products || res;
      return Array.isArray(items) ? items : getStoredProducts();
    } catch (err) {
      console.warn('Backend unavailable, falling back to cached catalog:', err.message);
      return getStoredProducts();
    }
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug) {
    try {
      const product = await apiClient.get(`/products/slug/${slug}`);
      return product;
    } catch (err) {
      const products = getStoredProducts();
      return products.find((p) => p.slug === slug) || null;
    }
  },

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    try {
      const product = await apiClient.get(`/products/${id}`);
      return product;
    } catch (err) {
      const products = getStoredProducts();
      return products.find((p) => p.id === id) || null;
    }
  },

  /**
   * Get Featured Products
   */
  async getFeaturedProducts() {
    try {
      const res = await apiClient.get('/products', { isFeatured: true });
      const items = res?.products || res;
      return Array.isArray(items) ? items : getStoredProducts().filter((p) => p.isFeatured);
    } catch (err) {
      return getStoredProducts().filter((p) => p.isFeatured);
    }
  },

  /**
   * Get Bestsellers
   */
  async getBestsellers(category = 'all') {
    try {
      const params = { isBestseller: true };
      if (category !== 'all') params.category = category;
      const res = await apiClient.get('/products', params);
      const items = res?.products || res;
      return Array.isArray(items) ? items : getStoredProducts().filter((p) => p.isBestseller);
    } catch (err) {
      let best = getStoredProducts().filter((p) => p.isBestseller);
      if (category !== 'all') best = best.filter((p) => p.categorySlug === category);
      return best;
    }
  },

  /**
   * Get New Arrivals
   */
  async getNewArrivals() {
    try {
      const res = await apiClient.get('/products', { isNewArrival: true });
      const items = res?.products || res;
      return Array.isArray(items) ? items : getStoredProducts().filter((p) => p.isNewArrival);
    } catch (err) {
      return getStoredProducts().filter((p) => p.isNewArrival);
    }
  },

  /**
   * Get Flash Sale Products
   */
  async getFlashSaleProducts() {
    try {
      const res = await apiClient.get('/products', { isFlashSale: true });
      const items = res?.products || res;
      return Array.isArray(items) ? items : getStoredProducts().filter((p) => p.isFlashSale);
    } catch (err) {
      return getStoredProducts().filter((p) => p.isFlashSale);
    }
  },

  /**
   * Get Related Products (same category, excluding current product)
   */
  async getRelatedProducts(productId, categorySlug, limit = 4) {
    try {
      const res = await apiClient.get('/products', { category: categorySlug, limit: limit + 1 });
      const items = res?.products || res;
      if (Array.isArray(items)) {
        return items.filter((p) => p.id !== productId).slice(0, limit);
      }
      const products = getStoredProducts();
      return products
        .filter((p) => p.id !== productId && (!categorySlug || p.categorySlug === categorySlug))
        .slice(0, limit);
    } catch (err) {
      const products = getStoredProducts();
      return products
        .filter((p) => p.id !== productId && (!categorySlug || p.categorySlug === categorySlug))
        .slice(0, limit);
    }
  },

  /**
   * Instant search
   */
  async searchProducts(query) {
    if (!query || query.trim().length === 0) return [];
    try {
      const res = await apiClient.get('/products', { search: query.trim() });
      const items = res?.products || res;
      return Array.isArray(items) ? items : [];
    } catch (err) {
      const q = query.toLowerCase().trim();
      return getStoredProducts().filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
  },

  /**
   * Admin: Add new product
   */
  async createProduct(productData) {
    try {
      const created = await apiClient.post('/admin/products', productData);
      return created;
    } catch (err) {
      console.warn('Falling back to local creation:', err.message);
      const products = getStoredProducts();
      const newProduct = {
        ...productData,
        id: `prod-${Date.now()}`,
        slug: (productData.name || 'product')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newProduct, ...products]));
      return newProduct;
    }
  },

  /**
   * Admin: Update existing product
   */
  async updateProduct(id, updatedFields) {
    try {
      const updated = await apiClient.patch(`/admin/products/${id}`, updatedFields);
      return updated;
    } catch (err) {
      const products = getStoredProducts();
      const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((p) => p.id === id);
    }
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      return true;
    } catch (err) {
      const products = getStoredProducts();
      const updated = products.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  },

  /**
   * Admin: Upload product image to Supabase Storage
   */
  async uploadProductImage(productId, file, isPrimary = false) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('isPrimary', String(isPrimary));
    return await apiClient.post(`/admin/products/${productId}/images`, formData);
  },
};
