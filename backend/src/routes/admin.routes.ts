import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

// All routes require authentication and admin/founder role
router.use(authenticate);
router.use(requireRole(['admin', 'founder']));

// USER MANAGEMENT
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', requireRole(['founder']), adminController.deleteUser);

// ACTIVITY LOGS
router.get('/activity-logs', adminController.getActivityLogs);

// SETTINGS (founder only for analytics settings)
router.get('/settings', adminController.getAllSettings);
router.put('/settings/:key', adminController.updateSetting);

// ANALYTICS
router.get('/analytics', analyticsController.getAnalytics);
router.get('/analytics/users', analyticsController.getUserStats);

export default router;
