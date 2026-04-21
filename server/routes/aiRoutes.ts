import express from 'express';
const router = express.Router();
import { runAIScreening, getJobScreeningResults } from '../controllers/aiScreeningController';
import { protect } from '../middleware/authMiddleware';

// POST /api/ai/screen/:jobId  — run Gemini screening for all candidates of a job
router.post('/screen/:jobId', protect, runAIScreening);

// GET /api/ai/screen/:jobId/results  — get previously saved results
router.get('/screen/:jobId/results', protect, getJobScreeningResults);

export default router;
