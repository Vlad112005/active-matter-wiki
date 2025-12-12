import { Router } from 'express';
import { getPublicSettings, getAllSettings, updateSetting } from '../controllers/settings';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/public', getPublicSettings);

// Protected
router.get('/', authenticate, requireRole(['admin', 'founder']), getAllSettings);
router.put('/:key', authenticate, requireRole(['admin', 'founder']), updateSetting);

export default router;
