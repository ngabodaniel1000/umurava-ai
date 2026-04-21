import express from 'express';
const router = express.Router();
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
} from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getJobs).post(protect, createJob);
router
    .route('/:id')
    .get(protect, getJobById)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

export default router;
