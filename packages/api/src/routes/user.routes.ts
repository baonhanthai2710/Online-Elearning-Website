import { Router } from 'express';
import { Role } from '@prisma/client';
import { getUserProfileController, updateUserProfileController } from '../controllers/user.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

// Get current user profile (authenticated)
router.get(
    '/users/profile',
    isAuthenticated,
    getUserProfileController
);

// Update current user profile (authenticated)
router.put(
    '/users/profile',
    isAuthenticated,
    updateUserProfileController
);

export default router;

