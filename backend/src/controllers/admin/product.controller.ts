import { Request, Response, NextFunction } from 'express';
import { productService } from '../../services/product.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { BadRequestError } from '../../utils/errors.js';

export class AdminProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        ...req.query,
        status: (req.query.status as string) || 'all',
      };
      const products = await productService.getProducts(filters as any);
      return ApiResponse.success(res, {
        message: 'Admin products retrieved successfully',
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

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      return ApiResponse.success(res, {
        statusCode: 201,
        message: `Product "${product.name}" created successfully`,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const updated = await productService.updateProduct(id, req.body);
      return ApiResponse.success(res, {
        message: `Product "${updated?.name || id}" updated successfully`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await productService.deleteProduct(id);
      return ApiResponse.success(res, {
        message: `Product with ID '${id}' deleted successfully`,
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const file = req.file;

      if (!file) {
        throw new BadRequestError('No image file provided for upload');
      }

      const result = await productService.uploadProductImage(
        id,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      return ApiResponse.success(res, {
        statusCode: 201,
        message: 'Product image uploaded to Supabase Storage successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async reorderImages(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { imageUrls } = req.body;
      const updated = await productService.reorderProductImages(id, imageUrls);
      return ApiResponse.success(res, {
        message: 'Product images reordered successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const imageUrl = (req.body?.imageUrl || req.query?.imageUrl) as string;
      const storagePath = req.body?.storagePath as string | undefined;

      if (!imageUrl) {
        throw new BadRequestError('Image URL is required to delete image');
      }

      const updated = await productService.deleteProductImage(id, imageUrl, storagePath);
      return ApiResponse.success(res, {
        message: 'Product image removed successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminProductController = new AdminProductController();
