import { Router } from 'express';
import {
  getAllLevels,
  getLevelByCode,
  createLevel,
  updateLevel,
  deleteLevel,
  moveLevel,
} from '../controllers/monolithController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

// Публичные маршруты
router.get('/levels', getAllLevels);
router.get('/levels/:code', getLevelByCode);

// Админские маршруты
router.post('/levels', authenticate, requireRole(['admin', 'founder']), createLevel);
router.put('/levels/:id', authenticate, requireRole(['admin', 'founder']), updateLevel);
router.delete('/levels/:id', authenticate, requireRole(['admin', 'founder']), deleteLevel);
router.post('/levels/:id/move', authenticate, requireRole(['admin', 'founder']), moveLevel);

export default router;
