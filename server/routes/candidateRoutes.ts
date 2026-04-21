import express from 'express';
const router = express.Router();
import {
    addCandidate,
    getCandidates,
    getCandidateById,
    deleteCandidate,
} from '../controllers/candidateController';
import { protect } from '../middleware/authMiddleware';

router.route('/').get(protect, getCandidates).post(protect, addCandidate);
router.route('/:id').get(protect, getCandidateById).delete(protect, deleteCandidate);

export default router;
