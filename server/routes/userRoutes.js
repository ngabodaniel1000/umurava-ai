const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    logoutUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
