import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services/category.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminCategoryController {
  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories(false);
      return ApiResponse.success(res, {
        message: 'Admin categories retrieved successfully',
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const category = await categoryService.getCategoryBySlug(id);
      return ApiResponse.success(res, {
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await categoryService.createCategory(req.body);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: `Category "${created.name}" created successfully`,
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await categoryService.updateCategory(id, req.body);
      return ApiResponse.success(res, {
        message: `Category "${updated?.name || id}" updated successfully`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await categoryService.deleteCategory(id);
      return ApiResponse.success(res, {
        message: `Category with ID '${id}' deleted successfully`,
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminCategoryController = new AdminCategoryController();
