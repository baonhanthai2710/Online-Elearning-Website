import { Router } from 'express';
import { Role } from '@prisma/client';
import { getQuizController, submitQuizController, getQuizHistoryController, getQuizAttemptsController } from '../controllers/quiz.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

// Get all quiz attempts history for current student
router.get('/quiz/history', isAuthenticated, isAuthorized([Role.STUDENT]), getQuizHistoryController);

// Get attempts for a specific quiz
router.get('/quiz/:contentId/attempts', isAuthenticated, isAuthorized([Role.STUDENT]), getQuizAttemptsController);

// Get quiz questions
router.get('/quiz/:contentId', isAuthenticated, isAuthorized([Role.STUDENT]), getQuizController);

// Submit quiz answers
router.post('/quiz/submit/:contentId', isAuthenticated, isAuthorized([Role.STUDENT]), submitQuizController);

export default router;
