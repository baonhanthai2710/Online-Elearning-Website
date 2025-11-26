import { Router } from 'express';
import { sendContactController } from '../controllers/contact.controller';

const router = Router();

// Send contact/feedback form (public)
router.post('/contact', sendContactController);

export default router;

