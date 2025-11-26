import { Router } from 'express';
import { Role } from '@prisma/client';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import {
    markContentCompletedController,
    unmarkContentCompletedController,
    getCompletedContentsController,
} from '../controllers/progress.controller';

const router = Router();

// Mark content as completed
router.post(
    '/progress/content/:contentId/complete',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    markContentCompletedController
);

// Unmark content (toggle off)
router.delete(
    '/progress/content/:contentId/complete',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    unmarkContentCompletedController
);

// Get completed contents for a course
router.get(
    '/progress/course/:courseId/completed',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    getCompletedContentsController
);

export default router;

