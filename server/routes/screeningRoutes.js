const express = require('express');
const router = express.Router();
const {
    createScreeningResult,
    getScreeningResults,
    updateScreeningStatus,
} = require('../controllers/screeningController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getScreeningResults).post(protect, createScreeningResult);
router.route('/:id').put(protect, updateScreeningStatus);

module.exports = router;
