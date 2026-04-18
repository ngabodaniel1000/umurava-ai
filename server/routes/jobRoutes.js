const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getJobs).post(protect, createJob);
router
    .route('/:id')
    .get(protect, getJobById)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;
