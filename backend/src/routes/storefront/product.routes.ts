import { Router } from 'express';
import { storefrontProductController } from '../../controllers/storefront/product.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { getProductsQuerySchema } from '../../validators/product.validator.js';

const router = Router();

// Specialized curated lists
router.get('/featured', (req, res, next) => storefrontProductController.getFeatured(req, res, next));
router.get('/bestsellers', (req, res, next) => storefrontProductController.getBestsellers(req, res, next));
router.get('/new-arrivals', (req, res, next) => storefrontProductController.getNewArrivals(req, res, next));
router.get('/flash-sales', (req, res, next) => storefrontProductController.getFlashSales(req, res, next));

// Main product listing with filtering, searching, and pagination
router.get('/', validateRequest(getProductsQuerySchema), (req, res, next) =>
  storefrontProductController.getProducts(req, res, next)
);

// Slug and ID lookups
router.get('/slug/:slug', (req, res, next) => storefrontProductController.getProductBySlug(req, res, next));
router.get('/:id', (req, res, next) => storefrontProductController.getProductById(req, res, next));

export const storefrontProductRoutes = router;
