/**
 * Product Service (API-Ready Abstraction Layer)
 * Currently backed by mock dataset + localStorage persistence.
 * Can be swapped with Axios / Fetch calls to real REST/GraphQL backend
 * without modifying any React UI components.
 */

import { mockProducts } from '../data/mockProducts';

const STORAGE_KEY = 'aura_custom_products';

function getStoredProducts() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockProducts;
    const parsed = JSON.parse(custom);
    // Combine base mock products with custom added/edited products
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockProducts;
  } catch (e) {
    console.warn('Failed to parse custom products, falling back to mock dataset:', e);
    return mockProducts;
  }
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage:', e);
  }
}

export const productService = {
  /**
   * Fetch all products with optional filtering and sorting
   */
  async getProducts(filters = {}) {
    // Simulate brief network latency for realistic UX & skeletons
    await new Promise((resolve) => setTimeout(resolve, 80));

    let products = [...getStoredProducts()];

    // Filter by Category
    if (filters.category && filters.category !== 'all') {
      products = products.filter(
        (p) => p.categorySlug?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by Price range
    if (typeof filters.minPrice === 'number') {
      products = products.filter((p) => p.price >= filters.minPrice);
    }
    if (typeof filters.maxPrice === 'number') {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }

    // Filter by Size
    if (filters.size) {
      products = products.filter((p) => (p.sizes || []).includes(filters.size));
    }

    // Filter by Color
    if (filters.color) {
      products = products.filter((p) =>
        (p.colors || []).some(
          (c) => c.name.toLowerCase() === filters.color.toLowerCase()
        )
      );
    }

    // Filter by Availability / Stock
    if (filters.inStockOnly) {
      products = products.filter((p) => (p.stock || 0) > 0);
    }

    // Filter by Discount
    if (filters.discountOnly) {
      products = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low-to-high':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-to-low':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'highest-rated':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'most-popular':
        default:
          products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
      }
    }

    return products;
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const products = getStoredProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const products = getStoredProducts();
    return products.find((p) => p.id === id) || null;
  },

  /**
   * Get Featured Products
   */
  async getFeaturedProducts() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const products = getStoredProducts();
    return products.filter((p) => p.isFeatured);
  },

  /**
   * Get Bestsellers (optionally filtered by category)
   */
  async getBestsellers(category = 'all') {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const products = getStoredProducts();
    let best = products.filter((p) => p.isBestseller);
    if (category !== 'all') {
      best = best.filter((p) => p.categorySlug === category);
    }
    return best;
  },

  /**
   * Get New Arrivals
   */
  async getNewArrivals() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const products = getStoredProducts();
    return products.filter((p) => p.isNewArrival);
  },

  /**
   * Get Flash Sale Products
   */
  async getFlashSaleProducts() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const products = getStoredProducts();
    return products.filter((p) => p.isFlashSale);
  },

  /**
   * Instant search suggestions & matching products
   */
  async searchProducts(query) {
    if (!query || query.trim().length === 0) return [];
    await new Promise((resolve) => setTimeout(resolve, 40));
    const q = query.toLowerCase().trim();
    const products = getStoredProducts();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  /**
   * Admin: Add new product
   */
  async createProduct(productData) {
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
    const updated = [newProduct, ...products];
    saveStoredProducts(updated);
    return newProduct;
  },

  /**
   * Admin: Update existing product
   */
  async updateProduct(id, updatedFields) {
    const products = getStoredProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveStoredProducts(updated);
    return updated.find((p) => p.id === id);
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    const products = getStoredProducts();
    const updated = products.filter((p) => p.id !== id);
    saveStoredProducts(updated);
    return true;
  },
};
