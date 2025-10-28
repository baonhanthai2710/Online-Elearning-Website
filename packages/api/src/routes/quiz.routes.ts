import { Router } from 'express';
import { Role } from '@prisma/client';
import { getQuizController, submitQuizController } from '../controllers/quiz.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

router.get('/quiz/:contentId', isAuthenticated, isAuthorized([Role.STUDENT]), getQuizController);
router.post('/quiz/submit/:contentId', isAuthenticated, isAuthorized([Role.STUDENT]), submitQuizController);

export default router;
