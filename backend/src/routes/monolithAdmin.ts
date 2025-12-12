import { Router } from 'express';
import {
  getAllMonolithLevels,
  getMonolithLevel,
  createMonolithLevel,
  updateMonolithLevel,
  addMonolithUnlock,
  updateMonolithUnlock,
  deleteMonolithUnlock,
} from '../controllers/monolithAdminController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Только для founder

// Уровни
router.get('/levels', authenticate, getAllMonolithLevels);
router.get('/levels/:levelId', authenticate, getMonolithLevel);
router.post('/levels', authenticate, createMonolithLevel);
router.put('/levels/:levelId', authenticate, updateMonolithLevel);

// Разблокировки
router.post('/levels/:levelId/unlocks', authenticate, addMonolithUnlock);
router.put('/unlocks/:unlockId', authenticate, updateMonolithUnlock);
router.delete('/unlocks/:unlockId', authenticate, deleteMonolithUnlock);

export default router;
