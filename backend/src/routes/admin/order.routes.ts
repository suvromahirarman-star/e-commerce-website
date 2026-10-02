import { Router } from 'express';
import { adminOrderController } from '../../controllers/admin.order.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { orderQuerySchema, updateOrderStatusSchema } from '../../validators/order.validator.js';

const router = Router();

// GET /api/v1/admin/orders
router.get('/', validate(orderQuerySchema), (req, res, next) =>
  adminOrderController.getOrders(req, res, next)
);

// GET /api/v1/admin/orders/:id
router.get('/:id', (req, res, next) =>
  adminOrderController.getOrderById(req, res, next)
);

// PATCH /api/v1/admin/orders/:id/status
router.patch('/:id/status', validate(updateOrderStatusSchema), (req, res, next) =>
  adminOrderController.updateStatus(req, res, next)
);

export const adminOrderRoutes = router;

