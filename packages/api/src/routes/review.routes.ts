import { Router } from 'express';
import { Role } from '@prisma/client';
import {
    getCourseReviewsController,
    getUserReviewController,
    createOrUpdateReviewController,
    deleteReviewController,
} from '../controllers/review.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

// Get all reviews for a course (public)
router.get('/courses/:courseId/reviews', getCourseReviewsController);

// Get current user's review for a course (authenticated)
router.get(
    '/courses/:courseId/reviews/my',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    getUserReviewController
);

// Create or update review (authenticated student)
router.post(
    '/courses/:courseId/reviews',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    createOrUpdateReviewController
);

// Delete review (authenticated student)
router.delete(
    '/reviews/:id',
    isAuthenticated,
    isAuthorized([Role.STUDENT]),
    deleteReviewController
);

export default router;

