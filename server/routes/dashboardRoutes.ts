import express from 'express';
const router = express.Router();
import { getDashboardStats, getRecentScreenings } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

router.get('/stats', protect, getDashboardStats);
router.get('/recent', protect, getRecentScreenings);

export default router;
