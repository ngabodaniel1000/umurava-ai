import express from 'express';
const router = express.Router();
import multer from 'multer';
import { runAIScreening, getJobScreeningResults, parseAndUploadCandidates } from '../controllers/aiScreeningController';
import { protect } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ai/screen/:jobId  — run Gemini screening for all candidates of a job
router.post('/screen/:jobId', protect, runAIScreening);

// GET /api/ai/screen/:jobId/results  — get previously saved results
router.get('/screen/:jobId/results', protect, getJobScreeningResults);

// POST /api/ai/parse-candidates/:jobId - parse uploads with Gemini
router.post('/parse-candidates/:jobId', protect, upload.array('files'), parseAndUploadCandidates);

export default router;
