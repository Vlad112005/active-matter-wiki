import { Router } from 'express';
import { getPublicSettings, getSettings, updateSetting } from '../controllers/settings';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/public', getPublicSettings);

// Protected (использовать только если есть в контроллере)
// router.get('/', authenticate, requireRole(['admin', 'founder']), getSettings);
// router.put('/:key', authenticate, requireRole(['admin', 'founder']), updateSetting);

export default router;
