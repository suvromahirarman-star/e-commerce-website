import { Router } from 'express';
import { adminCustomerController } from '../../controllers/admin/customer.controller.js';

const router = Router();

// GET /api/v1/admin/customers
router.get('/', (req, res, next) =>
  adminCustomerController.getCustomers(req, res, next)
);

export const adminCustomerRoutes = router;
