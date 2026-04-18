const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentScreenings } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/recent', protect, getRecentScreenings);

module.exports = router;
