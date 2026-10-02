/**
 * Coupon Service (API-Connected Layer)
 */

import { apiClient } from './apiClient';
import { mockCoupons } from '../data/mockCoupons';

const STORAGE_KEY = 'aura_custom_coupons';

function getStoredCoupons() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (!custom) return mockCoupons;
    const parsed = JSON.parse(custom);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockCoupons;
  } catch (e) {
    return mockCoupons;
  }
}

export const couponService = {
  /**
   * Validate a promo code against current cart subtotal
   */
  async validateCoupon(code, subtotal = 0) {
    try {
      const result = await apiClient.post('/coupons/validate', {
        code: (code || '').trim().toUpperCase(),
        subtotal: Number(subtotal),
      });
      return result;
    } catch (err) {
      // Fallback
      const coupons = getStoredCoupons();
      const cleanCode = (code || '').trim().toUpperCase();
      const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

      if (!coupon) return { valid: false, message: 'Invalid promo code' };
      if (!coupon.active) return { valid: false, message: 'This coupon is no longer active' };
      if (new Date(coupon.expiryDate) < new Date())
        return { valid: false, message: 'This coupon has expired' };
      if (coupon.minSpend && subtotal < coupon.minSpend) {
        return {
          valid: false,
          message: `Minimum order of ৳${coupon.minSpend.toLocaleString()} required for this coupon`,
        };
      }

      let discountAmount =
        coupon.type === 'percentage'
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);

      return {
        valid: true,
        message: `Coupon "${coupon.code}" applied successfully!`,
        coupon,
        discountAmount,
      };
    }
  },

  /**
   * List all coupons for admin panel
   */
  async listCoupons() {
    try {
      const coupons = await apiClient.get('/admin/coupons');
      return Array.isArray(coupons) ? coupons : getStoredCoupons();
    } catch (err) {
      return getStoredCoupons();
    }
  },

  /**
   * Admin: Create a new voucher
   */
  async createCoupon(newCouponData) {
    try {
      return await apiClient.post('/admin/coupons', newCouponData);
    } catch (err) {
      const coupons = getStoredCoupons();
      const created = {
        ...newCouponData,
        id: `coup-${Date.now()}`,
        code: newCouponData.code.trim().toUpperCase(),
        timesUsed: 0,
        active: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([created, ...coupons]));
      return created;
    }
  },

  /**
   * Admin: Update coupon
   */
  async updateCoupon(id, updates) {
    try {
      return await apiClient.patch(`/admin/coupons/${id}`, updates);
    } catch (err) {
      const coupons = getStoredCoupons();
      const updated = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((c) => c.id === id);
    }
  },

  /**
   * Admin: Toggle active status
   */
  async toggleCouponStatus(id) {
    try {
      return await apiClient.patch(`/admin/coupons/${id}/toggle`);
    } catch (err) {
      const coupons = getStoredCoupons();
      const updated = coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find((c) => c.id === id);
    }
  },

  /**
   * Admin: Delete coupon
   */
  async deleteCoupon(id) {
    try {
      await apiClient.delete(`/admin/coupons/${id}`);
      return true;
    } catch (err) {
      const coupons = getStoredCoupons();
      const updated = coupons.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  },
};
