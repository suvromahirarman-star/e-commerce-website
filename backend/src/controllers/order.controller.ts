import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createGuestOrder(req.body);
      return ApiResponse.created(res, order, 'Order placed successfully.');
    } catch (err) {
      next(err);
    }
  }

  async getOrderByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const orderNumber = req.params.orderNumber || req.params.id;
      const order = await orderService.getOrderByNumber(orderNumber as string);
      return ApiResponse.success(res, {
        message: 'Order retrieved successfully.',
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
