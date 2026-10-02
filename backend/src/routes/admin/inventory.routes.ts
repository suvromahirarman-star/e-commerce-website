import { Router } from 'express';
import { adminInventoryController } from '../../controllers/admin/inventory.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateStockSchema } from '../../validators/adminOperations.validator.js';

const router = Router();

// GET /api/v1/admin/inventory
router.get('/', (req, res, next) =>
  adminInventoryController.getInventory(req, res, next)
);

// PATCH /api/v1/admin/inventory/:id
router.patch('/:id', validate(updateStockSchema), (req, res, next) =>
  adminInventoryController.updateStock(req, res, next)
);

export const adminInventoryRoutes = router;
