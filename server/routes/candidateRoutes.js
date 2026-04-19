const express = require('express');
const router = express.Router();
const {
    addCandidate,
    getCandidates,
    getCandidateById,
    deleteCandidate,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCandidates).post(protect, addCandidate);
router.route('/:id').get(protect, getCandidateById).delete(protect, deleteCandidate);

module.exports = router;
