import { Router } from 'express';
import multer from 'multer';
import { Role } from '@prisma/client';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import { uploadFileController } from '../controllers/upload.controller';

const router = Router();
const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 200 * 1024 * 1024,
    },
});

router.post('/upload', isAuthenticated, isAuthorized([Role.TEACHER, Role.ADMIN]), upload.single('file'), uploadFileController);

export default router;
