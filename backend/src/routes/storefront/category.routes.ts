import { Router } from 'express';
import { storefrontCategoryController } from '../../controllers/storefront/category.controller.js';

const router = Router();

router.get('/', (req, res, next) => storefrontCategoryController.getCategories(req, res, next));
router.get('/:slug', (req, res, next) => storefrontCategoryController.getCategoryBySlug(req, res, next));

export const storefrontCategoryRoutes = router;
