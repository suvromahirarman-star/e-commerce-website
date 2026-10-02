import { Request, Response, NextFunction } from 'express';
import { customerService } from '../../services/customer.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminCustomerController {
  async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.search || req.query.q) as string | undefined;
      const customers = await customerService.getGuestCustomers(search);
      return ApiResponse.success(res, {
        message: 'Guest patrons directory retrieved successfully',
        data: customers,
        meta: { total: customers.length },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminCustomerController = new AdminCustomerController();
