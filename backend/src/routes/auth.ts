import { Router } from 'express';
import {
  login,
  register,
  logout,
  getMe,
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', authenticate, authorize('admin'), register);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
