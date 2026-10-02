import { Router } from 'express';
import { adminProductController } from '../../controllers/admin/product.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  reorderImagesSchema,
} from '../../validators/product.validator.js';
import { uploadSingleImage } from '../../middleware/upload.middleware.js';

const router = Router();

// Product CRUD
router.get('/', (req, res, next) => adminProductController.getProducts(req, res, next));
router.post('/', validateRequest(createProductSchema), (req, res, next) =>
  adminProductController.createProduct(req, res, next)
);

router.get('/:id', (req, res, next) => adminProductController.getProductById(req, res, next));
router.patch('/:id', validateRequest(updateProductSchema), (req, res, next) =>
  adminProductController.updateProduct(req, res, next)
);
router.delete('/:id', (req, res, next) => adminProductController.deleteProduct(req, res, next));

// Product Supabase Image Management
router.post('/:id/images', uploadSingleImage, (req, res, next) =>
  adminProductController.uploadImage(req, res, next)
);
router.patch('/:id/images/reorder', validateRequest(reorderImagesSchema), (req, res, next) =>
  adminProductController.reorderImages(req, res, next)
);
router.delete('/:id/images', (req, res, next) =>
  adminProductController.deleteImage(req, res, next)
);

export const adminProductRoutes = router;
