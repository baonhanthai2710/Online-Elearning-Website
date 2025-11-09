import { Router } from 'express';
import { Role } from '@prisma/client';
import {
    createContentController,
    createCourseController,
    createModuleController,
    getCategoriesController,
    getCourseDetailController,
    getCoursesController,
    updateCourseController,
} from '../controllers/course.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router();

router.get('/categories', getCategoriesController);
router.get('/courses', getCoursesController);
router.get('/courses/:id', getCourseDetailController);

router.post('/courses', isAuthenticated, isAuthorized([Role.TEACHER]), createCourseController);
router.put('/courses/:id', isAuthenticated, isAuthorized([Role.TEACHER]), updateCourseController);
router.post('/modules', isAuthenticated, isAuthorized([Role.TEACHER]), createModuleController);
router.post('/content', isAuthenticated, isAuthorized([Role.TEACHER]), createContentController);

export default router;
