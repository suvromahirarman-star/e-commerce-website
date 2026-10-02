import { Request, Response, NextFunction } from 'express';
import { productService } from '../../services/product.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class StorefrontProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getProducts(req.query as any);
      return ApiResponse.success(res, {
        message: 'Products retrieved successfully',
        data: products,
        meta: { count: products.length },
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const product = await productService.getProductById(id);
      return ApiResponse.success(res, {
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.slug);
      const product = await productService.getProductBySlug(slug);
      return ApiResponse.success(res, {
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getFeaturedProducts(limit);
      return ApiResponse.success(res, {
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBestsellers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getBestsellers(limit);
      return ApiResponse.success(res, {
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async getNewArrivals(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getNewArrivals(limit);
      return ApiResponse.success(res, {
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFlashSales(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const products = await productService.getFlashSaleProducts(limit);
      return ApiResponse.success(res, {
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storefrontProductController = new StorefrontProductController();
