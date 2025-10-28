import { Router } from 'express';
import {
    getCategoriesController,
    getCourseDetailController,
    getCoursesController,
} from '../controllers/course.controller';

const router = Router();

router.get('/categories', getCategoriesController);
router.get('/courses', getCoursesController);
router.get('/courses/:id', getCourseDetailController);

export default router;
