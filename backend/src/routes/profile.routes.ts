import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as profileController from '../controllers/profile.controller';

const router = Router();

// Public routes
router.get('/user/:username', profileController.getUserPublicProfile);

// Protected routes
router.use(authenticate);
router.get('/me', profileController.getProfile);
router.put('/me', profileController.updateProfile);
router.post('/change-password', profileController.changePassword);

export default router;
