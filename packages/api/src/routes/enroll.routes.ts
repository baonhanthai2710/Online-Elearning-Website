import { Router } from 'express';
import { Role } from '@prisma/client';
import { checkoutCourseController, stripeWebhookController } from '../controllers/enroll.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

router.post('/enroll/checkout/:courseId', isAuthenticated, isAuthorized([Role.STUDENT]), checkoutCourseController);
router.post('/stripe-webhook', stripeWebhookController);

export default router;
