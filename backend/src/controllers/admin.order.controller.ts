import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AdminOrderController {
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        paymentMethod: req.query.paymentMethod as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
      };

      const result = await orderService.getOrders(filters);
      return ApiResponse.success(res, {
        message: 'Orders retrieved successfully',
        data: result.orders,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id as string);
      return ApiResponse.success(res, {
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const newStatus = req.body.orderStatus || req.body.status;
      const paymentStatus = req.body.paymentStatus;
      const updated = await orderService.updateOrderStatus(req.params.id as string, newStatus, paymentStatus);
      return ApiResponse.success(res, {
        message: `Order status updated to ${newStatus}`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminOrderController = new AdminOrderController();
