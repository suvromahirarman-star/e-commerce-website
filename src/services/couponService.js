/**
 * Coupon Service (API-Ready Abstraction Layer)
 */

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

function saveStoredCoupons(coupons) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Failed to save coupons to localStorage:', e);
  }
}

export const couponService = {
  /**
   * Validate a promo code against current cart subtotal
   */
  async validateCoupon(code, subtotal = 0) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const coupons = getStoredCoupons();
    const cleanCode = (code || '').trim().toUpperCase();

    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, message: 'Invalid promo code' };
    }

    if (!coupon.active) {
      return { valid: false, message: 'This coupon is no longer active' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This coupon has expired' };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `Minimum order of ৳${coupon.minSpend.toLocaleString()} required for this coupon`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon "${coupon.code}" applied successfully!`,
    };
  },

  async listCoupons() {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return getStoredCoupons();
  },

  async createCoupon(couponData) {
    const coupons = getStoredCoupons();
    const newCoupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      code: couponData.code.toUpperCase().trim(),
      timesUsed: 0,
      active: true,
    };
    const updated = [newCoupon, ...coupons];
    saveStoredCoupons(updated);
    return newCoupon;
  },

  async toggleCouponStatus(id) {
    const coupons = getStoredCoupons();
    const updated = coupons.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    saveStoredCoupons(updated);
    return updated.find((c) => c.id === id);
  },

  async deleteCoupon(id) {
    const coupons = getStoredCoupons();
    const updated = coupons.filter((c) => c.id !== id);
    saveStoredCoupons(updated);
    return true;
  },
};
