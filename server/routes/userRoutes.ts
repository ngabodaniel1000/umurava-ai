import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    getUserProfile,
    logoutUser,
    deleteAccount,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.delete('/account', protect, deleteAccount);

export default router;
