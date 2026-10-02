import { Request, Response, NextFunction } from 'express';
import { couponService } from '../../services/coupon.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class StorefrontCouponController {
  async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, subtotal } = req.body;
      const result = await couponService.validateCoupon(code, subtotal);

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
          valid: false,
        });
      }

      return ApiResponse.success(res, {
        message: result.message,
        data: {
          valid: true,
          coupon: result.coupon,
          discountAmount: result.discountAmount,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storefrontCouponController = new StorefrontCouponController();
