import { Request, Response, NextFunction } from 'express';
import { cmsService } from '../../services/cms.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class StorefrontCmsController {
  async getHomepageContent(_req: Request, res: Response, next: NextFunction) {
    try {
      const content = await cmsService.getHomepageContent();
      return ApiResponse.success(res, {
        message: 'Homepage content retrieved successfully',
        data: content,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await cmsService.getStoreSettings();
      return ApiResponse.success(res, {
        message: 'Store settings retrieved successfully',
        data: settings,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const storefrontCmsController = new StorefrontCmsController();
