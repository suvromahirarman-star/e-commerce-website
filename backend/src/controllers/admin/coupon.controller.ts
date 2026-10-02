import { Request, Response, NextFunction } from 'express';
import { couponService } from '../../services/coupon.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminCouponController {
  async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await couponService.listCoupons();
      return ApiResponse.success(res, {
        message: 'Coupons retrieved successfully',
        data: coupons,
        meta: { total: coupons.length },
      });
    } catch (err) {
      next(err);
    }
  }

  async getCouponById(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.getCouponById(req.params.id as string);
      return ApiResponse.success(res, {
        message: 'Coupon retrieved successfully',
        data: coupon,
      });
    } catch (err) {
      next(err);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await couponService.createCoupon(req.body);
      return ApiResponse.created(res, created, `Created voucher "${created.code}"`);
    } catch (err) {
      next(err);
    }
  }

  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await couponService.updateCoupon(req.params.id as string, req.body);
      return ApiResponse.success(res, {
        message: `Updated voucher "${updated.code}"`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleCouponStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await couponService.toggleCouponStatus(req.params.id as string);
      return ApiResponse.success(res, {
        message: `Coupon "${updated.code}" ${updated.active ? 'activated' : 'disabled'}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      await couponService.deleteCoupon(req.params.id as string);
      return ApiResponse.success(res, {
        message: 'Coupon deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminCouponController = new AdminCouponController();
