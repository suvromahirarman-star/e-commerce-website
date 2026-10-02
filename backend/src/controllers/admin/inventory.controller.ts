import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../../services/inventory.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminInventoryController {
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const filterType = req.query.filterType as string | undefined;
      const search = (req.query.search || req.query.q) as string | undefined;
      const items = await inventoryService.getInventory(filterType, search);
      return ApiResponse.success(res, {
        message: 'Inventory items retrieved successfully',
        data: items,
        meta: { total: items.length },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const updated = await inventoryService.updateStock(id as string, Number(stock));
      return ApiResponse.success(res, {
        message: `Stock updated to ${updated.stock} units`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminInventoryController = new AdminInventoryController();
