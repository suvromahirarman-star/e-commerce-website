import { Router } from 'express';
import { storefrontCmsController } from '../../controllers/storefront/cms.controller.js';

const router = Router();

router.get('/homepage', (req, res, next) => storefrontCmsController.getHomepageContent(req, res, next));
router.get('/settings', (req, res, next) => storefrontCmsController.getStoreSettings(req, res, next));

export const storefrontCmsRoutes = router;
