import { Router } from 'express';
import { orderController } from '../../controllers/order.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createOrderSchema } from '../../validators/order.validator.js';

const router = Router();

// Guest Checkout: POST /api/v1/orders
router.post('/', validate(createOrderSchema), (req, res, next) =>
  orderController.createOrder(req, res, next)
);

// Order Tracking: GET /api/v1/orders/:orderNumber
router.get('/:orderNumber', (req, res, next) =>
  orderController.getOrderByNumber(req, res, next)
);

export const storefrontOrderRoutes = router;

