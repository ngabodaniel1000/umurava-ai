const express = require('express');
const router = express.Router();
const { runAIScreening, getJobScreeningResults } = require('../controllers/aiScreeningController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/screen/:jobId  — run Gemini screening for all candidates of a job
router.post('/screen/:jobId', protect, runAIScreening);

// GET /api/ai/screen/:jobId/results  — get previously saved results
router.get('/screen/:jobId/results', protect, getJobScreeningResults);

module.exports = router;
