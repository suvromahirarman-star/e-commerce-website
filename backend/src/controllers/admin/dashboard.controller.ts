import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../../services/dashboard.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminDashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getDashboardStats();
      return ApiResponse.success(res, {
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminDashboardController = new AdminDashboardController();
