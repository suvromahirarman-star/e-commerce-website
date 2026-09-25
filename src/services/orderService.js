/**
 * Order Service (API-Ready Abstraction Layer)
 * Supports frictionless guest checkout and admin order status workflow
 */

import { mockOrders } from '../data/mockOrders';

const STORAGE_KEY = 'aura_custom_orders';

function getStoredOrders() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockOrders;
    const parsed = JSON.parse(custom);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockOrders;
  } catch (e) {
    return mockOrders;
  }
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage:', e);
  }
}

export const orderService = {
  /**
   * Guest Checkout: Create a new order without requiring customer account
   */
  async createGuestOrder(orderPayload) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const orders = getStoredOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      ...orderPayload,
      id: `AUR-${new Date().getFullYear()}-${randomSuffix}`,
      orderStatus: 'Pending',
      paymentStatus: orderPayload.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    saveStoredOrders(updated);
    return newOrder;
  },

  /**
   * Get all orders with optional search and status filter
   */
  async getOrders(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let orders = [...getStoredOrders()];

    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(
        (o) => o.orderStatus.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }

    return orders;
  },

  /**
   * Get order details by order ID
   */
  async getOrderById(orderId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const orders = getStoredOrders();
    return orders.find((o) => o.id === orderId) || null;
  },

  /**
   * Admin: Update order fulfillment status
   */
  async updateOrderStatus(orderId, newStatus) {
    const orders = getStoredOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: newStatus,
          updatedAt: new Date().toISOString(),
          deliveredAt: newStatus === 'Delivered' ? new Date().toISOString() : o.deliveredAt,
        };
      }
      return o;
    });
    saveStoredOrders(updated);
    return updated.find((o) => o.id === orderId);
  },
};
