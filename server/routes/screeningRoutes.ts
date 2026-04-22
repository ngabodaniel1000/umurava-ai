import express from 'express';
const router = express.Router();
import {
    createScreeningResult,
    getScreeningResults,
    updateScreeningStatus,
} from '../controllers/screeningController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getScreeningResults).post(protect, createScreeningResult);
router.route('/:id').put(protect, updateScreeningStatus);

export default router;
