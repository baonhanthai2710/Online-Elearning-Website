import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { getCommentsController, postCommentController } from '../controllers/comment.controller';

const router = Router();

router.get('/comments/:contentId', getCommentsController);
router.post('/comments/:contentId', isAuthenticated, postCommentController);

export default router;
