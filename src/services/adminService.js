/**
 * Admin Service (API-Connected Layer)
 * Aggregates operational analytics, inventory levels, guest customer directory, and homepage CMS
 */

import { apiClient } from './apiClient';
import { mockAdminStats } from '../data/mockAdminStats';

const CMS_STORAGE_KEY = 'aura_homepage_cms';

const defaultCmsContent = {
  hero: {
    badge: 'Autumn / Winter 2026 Collection',
    headline: 'Designed with Intention. Crafted to Endure.',
    supportingCopy: 'Architectural tailoring, Australian merino wool, and Italian vegetable-tanned leather essentials crafted for the modern wardrobe.',
    primaryCtaText: 'Explore New Arrivals',
    primaryCtaLink: '/shop?filter=new',
    secondaryCtaText: 'The Season Edit',
    secondaryCtaLink: '/about',
    heroImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
  },
  announcement: {
    enabled: true,
    text: 'Complimentary white-glove delivery on all orders over ৳3,000 across Bangladesh.',
    linkText: 'Shop New Arrivals',
    linkUrl: '/shop',
  },
  promotionalBanner: {
    title: 'THE MODERN ATELIER EDIT',
    subtitle: 'Limited Production Runs',
    description: 'Each piece is hand-numbered and cut in limited volumes to eliminate textile waste and preserve exclusivity.',
    ctaText: 'Discover Collection',
    ctaLink: '/category/mens',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  },
};

const SETTINGS_STORAGE_KEY = 'aura_store_settings';

const defaultStoreSettings = {
  storeName: 'AURA Studio',
  storeTagline: 'Modern Architectural Fashion & Objects',
  supportEmail: 'concierge@aurastudio.com',
  supportPhone: '+880 1712 345 678',
  addressLine1: 'House 14, Road 11, Block D',
  city: 'Banani, Dhaka 1213',
  country: 'Bangladesh',
  currency: 'BDT (৳)',
  insideDhakaShipping: 60,
  outsideDhakaShipping: 120,
  freeShippingThreshold: 3000,
  taxRatePercent: 0,
  enableGuestCheckout: true,
  enableCod: true,
  enableBkash: true,
  maintenanceMode: false,
};

export const adminService = {
  /**
   * Get high-level dashboard KPIs and charts
   */
  async getDashboardStats() {
    try {
      const stats = await apiClient.get('/admin/dashboard/stats');
      return stats;
    } catch (err) {
      console.warn('Dashboard stats API offline, falling back to mock KPIs:', err.message);
      return {
        kpis: {
          totalRevenue: 29840,
          totalOrders: 5,
          totalProducts: 12,
          totalCustomers: 5,
        },
        salesTrend: (mockAdminStats.salesTrend7Days || []).map((d) => ({
          day: d.day,
          amount: d.revenue ?? d.amount ?? 0,
          orders: d.orders ?? 0,
        })),
        salesTrend7Days: mockAdminStats.salesTrend7Days,
        categoryBreakdown: mockAdminStats.categoryBreakdown,
        orderStatusBreakdown: [
          { status: 'Delivered', count: 1 },
          { status: 'Shipped', count: 1 },
          { status: 'Processing', count: 1 },
          { status: 'Pending', count: 2 },
        ],
        recentOrders: [],
        lowStockProducts: [],
      };
    }
  },

  /**
   * Get inventory tracking table data
   */
  async getInventory(filterType = 'all', searchQuery = '') {
    try {
      const items = await apiClient.get('/admin/inventory', {
        filterType,
        search: searchQuery,
      });
      return Array.isArray(items) ? items : [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Get guest customer directory
   */
  async getGuestCustomers(searchQuery = '') {
    try {
      const customers = await apiClient.get('/admin/customers', { search: searchQuery });
      return Array.isArray(customers) ? customers : [];
    } catch (err) {
      return [];
    }
  },

  async getCustomersFromOrders() {
    return this.getGuestCustomers();
  },

  /**
   * Get homepage CMS config
   */
  async getHomepageContent() {
    try {
      const content = await apiClient.get('/content/homepage');
      return content || defaultCmsContent;
    } catch (err) {
      try {
        const saved = localStorage.getItem(CMS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultCmsContent;
      } catch (e) {
        return defaultCmsContent;
      }
    }
  },

  /**
   * Update homepage CMS config
   */
  async updateHomepageContent(newContent) {
    try {
      const updated = await apiClient.put('/admin/content/homepage', newContent);
      return updated;
    } catch (err) {
      const merged = { ...defaultCmsContent, ...newContent };
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  },

  /**
   * Get store operational settings
   */
  async getStoreSettings() {
    try {
      const settings = await apiClient.get('/settings');
      return settings || defaultStoreSettings;
    } catch (err) {
      try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return saved ? { ...defaultStoreSettings, ...JSON.parse(saved) } : defaultStoreSettings;
      } catch (e) {
        return defaultStoreSettings;
      }
    }
  },

  /**
   * Update store operational settings
   */
  async updateStoreSettings(newSettings) {
    try {
      const updated = await apiClient.put('/admin/settings', newSettings);
      return updated;
    } catch (err) {
      const merged = { ...defaultStoreSettings, ...newSettings };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  },
};
