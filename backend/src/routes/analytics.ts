import { Router } from 'express';
import { getDashboard, getActivityLogs, getGrowthStats } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All endpoints require authentication + founder role
router.get('/dashboard', authenticate, getDashboard);
router.get('/activity-logs', authenticate, getActivityLogs);
router.get('/growth-stats', authenticate, getGrowthStats);

export default router;
