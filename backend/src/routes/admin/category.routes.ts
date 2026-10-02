import { Router } from 'express';
import { adminCategoryController } from '../../controllers/admin/category.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validators/category.validator.js';

const router = Router();

router.get('/', (req, res, next) => adminCategoryController.getCategories(req, res, next));
router.get('/:id', (req, res, next) => adminCategoryController.getCategoryById(req, res, next));
router.post('/', validateRequest(createCategorySchema), (req, res, next) =>
  adminCategoryController.createCategory(req, res, next)
);
router.patch('/:id', validateRequest(updateCategorySchema), (req, res, next) =>
  adminCategoryController.updateCategory(req, res, next)
);
router.delete('/:id', (req, res, next) => adminCategoryController.deleteCategory(req, res, next));

export const adminCategoryRoutes = router;
