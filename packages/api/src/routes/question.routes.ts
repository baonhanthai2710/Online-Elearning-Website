import { Router } from 'express';
import { Role } from '@prisma/client';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import {
    createQuestionController,
    deleteQuestionController,
    createOptionController,
    deleteOptionController,
    getQuizQuestionsController,
} from '../controllers/question.controller';

const router = Router();

// Get quiz with questions (for teacher and admin)
router.get('/quiz/:contentId/manage', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), getQuizQuestionsController);

// Question management
router.post('/questions', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), createQuestionController);
router.delete('/questions/:id', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), deleteQuestionController);

// Option management
router.post('/options', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), createOptionController);
router.delete('/options/:id', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), deleteOptionController);

export default router;

