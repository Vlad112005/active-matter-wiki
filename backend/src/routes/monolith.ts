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
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

// Публичные маршруты
router.get('/levels', getAllLevels);
router.get('/levels/:code', getLevelByCode);

// Админские маршруты (admin + founder)
router.post('/levels', authenticate, requireAdmin, createLevel);
router.put('/levels/:id', authenticate, requireAdmin, updateLevel);
router.delete('/levels/:id', authenticate, requireAdmin, deleteLevel);
router.post('/levels/:id/move', authenticate, requireAdmin, moveLevel);

export default router;
