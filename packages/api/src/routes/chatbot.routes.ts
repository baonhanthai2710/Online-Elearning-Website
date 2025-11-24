import { Router } from 'express';
import {
    initializeVectorStoreController,
    askQuestionController,
    askQuestionStreamController,
    getVectorStoreStatsController,
} from '../controllers/chatbot.controller';

const router = Router();

// Initialize vector store (admin only - should be protected in production)
router.post('/chatbot/initialize', initializeVectorStoreController);

// Ask a question (regular response)
router.post('/chatbot/ask', askQuestionController);

// Ask a question (streaming response)
router.post('/chatbot/ask/stream', askQuestionStreamController);

// Get vector store statistics
router.get('/chatbot/stats', getVectorStoreStatsController);

export default router;

