import { Request, Response, NextFunction } from 'express';
import { cmsService } from '../../services/cms.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminCmsController {
  async getHomepageContent(req: Request, res: Response, next: NextFunction) {
    try {
      const content = await cmsService.getHomepageContent();
      return ApiResponse.success(res, {
        message: 'Homepage CMS content retrieved successfully',
        data: content,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateHomepageContent(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await cmsService.updateHomepageContent(req.body);
      return ApiResponse.success(res, {
        message: 'Homepage CMS content updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStoreSettings(req: Request, res: Response, next: NextFunction) {
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

  async updateStoreSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await cmsService.updateStoreSettings(req.body);
      return ApiResponse.success(res, {
        message: 'Store settings updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminCmsController = new AdminCmsController();
