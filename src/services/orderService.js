/**
 * Order Service (API-Connected Layer)
 * Supports frictionless guest checkout and admin order status workflow
 */

import { apiClient } from './apiClient';
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

export const orderService = {
  /**
   * Guest Checkout: Post order to authoritative backend engine
   */
  async createGuestOrder(orderPayload) {
    try {
      const created = await apiClient.post('/orders', orderPayload);
      return created;
    } catch (err) {
      console.warn('Backend order submission offline, using local simulation:', err.message);
      const orders = getStoredOrders();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        ...orderPayload,
        id: `AUR-${new Date().getFullYear()}-${randomSuffix}`,
        orderStatus: 'Pending',
        paymentStatus: orderPayload.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newOrder, ...orders]));
      return newOrder;
    }
  },

  /**
   * Get all orders with optional search and status filter
   */
  async getOrders(filters = {}) {
    try {
      const res = await apiClient.get('/admin/orders', filters);
      const orders = res?.orders || res;
      return Array.isArray(orders) ? orders : getStoredOrders();
    } catch (err) {
      let orders = [...getStoredOrders()];

      if (filters.status && filters.status !== 'all') {
        orders = orders.filter(
          (o) => o.orderStatus?.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        orders = orders.filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.customer?.fullName?.toLowerCase().includes(q) ||
            o.customer?.phone?.toLowerCase().includes(q) ||
            o.customer?.email?.toLowerCase().includes(q)
        );
      }

      return orders;
    }
  },

  /**
   * Get order details by order ID / number
   */
  async getOrderById(orderId) {
    try {
      return await apiClient.get(`/orders/${orderId}`);
    } catch (err) {
      try {
        return await apiClient.get(`/admin/orders/${orderId}`);
      } catch (adminErr) {
        const orders = getStoredOrders();
        return orders.find((o) => o.id === orderId) || null;
      }
    }
  },

  /**
   * Admin: Update order fulfillment status
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      return await apiClient.patch(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
    } catch (err) {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((o) => o.id === orderId);
    }
  },
};
