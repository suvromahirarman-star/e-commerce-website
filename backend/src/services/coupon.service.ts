import { couponRepository, CouponRecord } from '../repositories/coupon.repository.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: {
    id: string;
    code: string;
    type: string;
    value: number;
    minSpend: number;
    expiryDate: string;
  };
  discountAmount?: number;
}

export class CouponService {
  /**
   * Public coupon validation
   */
  async validateCoupon(code: string, subtotal = 0): Promise<CouponValidationResult> {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Promo code cannot be empty' };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await couponRepository.findByCode(cleanCode);

    if (!coupon) {
      return { valid: false, message: 'Invalid promo code' };
    }

    if (!coupon.active) {
      return { valid: false, message: 'This coupon is no longer active' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'This coupon has expired' };
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, message: 'This coupon has reached its maximum usage limit' };
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
      message: `Coupon "${coupon.code}" applied successfully!`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minSpend: coupon.minSpend,
        expiryDate: coupon.expiryDate,
      },
      discountAmount,
    };
  }

  /**
   * Admin: List all coupons
   */
  async listCoupons(): Promise<CouponRecord[]> {
    return await couponRepository.findAll();
  }

  /**
   * Admin: Get coupon by ID
   */
  async getCouponById(id: string): Promise<CouponRecord> {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundError(`Coupon with ID "${id}" not found`);
    }
    return coupon;
  }

  /**
   * Admin: Create coupon
   */
  async createCoupon(data: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minSpend?: number;
    expiryDate: string;
    usageLimit?: number | null;
    active?: boolean;
  }): Promise<CouponRecord> {
    const cleanCode = data.code.trim().toUpperCase();
    const existing = await couponRepository.findByCode(cleanCode);
    if (existing) {
      throw new BadRequestError(`Coupon code "${cleanCode}" already exists.`);
    }

    if (data.type === 'percentage' && (data.value <= 0 || data.value > 100)) {
      throw new BadRequestError('Percentage discount value must be between 1 and 100.');
    }

    if (data.type === 'fixed' && data.value <= 0) {
      throw new BadRequestError('Fixed discount value must be greater than 0.');
    }

    return await couponRepository.create(data);
  }

  /**
   * Admin: Update coupon
   */
  async updateCoupon(id: string, updates: Partial<CouponRecord>): Promise<CouponRecord> {
    if (updates.code) {
      const cleanCode = updates.code.trim().toUpperCase();
      const existing = await couponRepository.findByCode(cleanCode);
      if (existing && existing.id !== id) {
        throw new BadRequestError(`Coupon code "${cleanCode}" is already in use.`);
      }
    }

    return await couponRepository.update(id, updates);
  }

  /**
   * Admin: Toggle active status
   */
  async toggleCouponStatus(id: string): Promise<CouponRecord> {
    const coupon = await this.getCouponById(id);
    return await couponRepository.update(id, { active: !coupon.active });
  }

  /**
   * Admin: Delete coupon
   */
  async deleteCoupon(id: string): Promise<boolean> {
    const coupon = await this.getCouponById(id);
    return await couponRepository.delete(coupon.id);
  }
}

export const couponService = new CouponService();
