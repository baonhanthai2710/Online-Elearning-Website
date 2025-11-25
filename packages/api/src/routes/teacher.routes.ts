import { Router } from 'express';
import { getTeacherProfileController, getAllTeachersController } from '../controllers/teacher.controller';

const router = Router();

// Get all teachers (public)
router.get('/teachers', getAllTeachersController);

// Get teacher profile by ID (public)
router.get('/teachers/:id', getTeacherProfileController);

export default router;

