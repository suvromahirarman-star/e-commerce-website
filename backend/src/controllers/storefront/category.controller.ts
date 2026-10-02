import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../../services/category.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class StorefrontCategoryController {
  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories(true);
      return ApiResponse.success(res, {
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.slug);
      const category = await categoryService.getCategoryBySlug(slug);
      return ApiResponse.success(res, {
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storefrontCategoryController = new StorefrontCategoryController();
