import { Router } from 'express';
import { requestPasswordResetController, resetPasswordController } from '../controllers/password.controller';

const router = Router();

// Request password reset (public)
router.post('/password/forgot', requestPasswordResetController);

// Reset password with token (public)
router.post('/password/reset', resetPasswordController);

export default router;

