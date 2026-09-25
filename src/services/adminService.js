/**
 * Admin Service (API-Ready Abstraction Layer)
 * Aggregates operational analytics, inventory levels, guest customer directory, and homepage CMS
 */

import { mockAdminStats } from '../data/mockAdminStats';
import { productService } from './productService';
import { orderService } from './orderService';

const CMS_STORAGE_KEY = 'aura_homepage_cms';

const defaultCmsContent = {
  hero: {
    badge: 'Autum / Winter 2026 Collection',
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

export const adminService = {
  /**
   * Get high-level dashboard KPIs and charts
   */
  async getDashboardStats() {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const products = await productService.getProducts();
    const orders = await orderService.getOrders();

    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const customersMap = new Map();
    orders.forEach((o) => {
      if (o.customer?.email) customersMap.set(o.customer.email, true);
    });

    return {
      kpis: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customersMap.size,
      },
      salesTrend7Days: mockAdminStats.salesTrend7Days,
      categoryBreakdown: mockAdminStats.categoryBreakdown,
      recentOrders: orders.slice(0, 5),
      lowStockProducts: products.filter((p) => (p.stock || 0) <= 10).slice(0, 5),
    };
  },

  /**
   * Get inventory tracking table data
   */
  async getInventory() {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const products = await productService.getProducts();
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      stock: p.stock,
      status: p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock',
      image: p.images?.[0] || '',
    }));
  },

  /**
   * Derive customer profiles from guest orders
   */
  async getCustomersFromOrders() {
    await new Promise((resolve) => setTimeout(resolve, 70));
    const orders = await orderService.getOrders();
    const customersMap = new Map();

    orders.forEach((order) => {
      const email = order.customer?.email || 'guest@example.com';
      if (!customersMap.has(email)) {
        customersMap.set(email, {
          fullName: order.customer?.fullName || 'Guest Customer',
          email,
          phone: order.customer?.phone || '—',
          city: order.customer?.city || '—',
          address: order.customer?.address || '—',
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          orders: [],
        });
      }

      const cust = customersMap.get(email);
      cust.orderCount += 1;
      cust.totalSpent += order.total || 0;
      cust.orders.push(order.id);
      if (new Date(order.createdAt) > new Date(cust.lastOrderDate)) {
        cust.lastOrderDate = order.createdAt;
      }
    });

    return Array.from(customersMap.values());
  },

  /**
   * Get homepage CMS config
   */
  getHomepageContent() {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultCmsContent;
    } catch (e) {
      return defaultCmsContent;
    }
  },

  /**
   * Update homepage CMS config
   */
  updateHomepageContent(newContent) {
    try {
      const merged = { ...defaultCmsContent, ...newContent };
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Failed to save homepage CMS:', e);
      return defaultCmsContent;
    }
  },
};
