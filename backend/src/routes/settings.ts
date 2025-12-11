import { Router } from 'express';
import {
  getPublicSettings,
  getAllSettings,
  updateSetting,
  deleteSetting,
} from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Публичные настройки
router.get('/public', getPublicSettings);

// Админ маршруты
router.get('/', authenticate, authorize('admin', 'founder'), getAllSettings);
router.put('/', authenticate, authorize('admin', 'founder'), updateSetting);
router.delete('/:key', authenticate, authorize('founder'), deleteSetting);

export default router;
