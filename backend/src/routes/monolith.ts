import { Router } from 'express';
import { getAllLevels, getLevelByCode } from '../controllers/monolithController.js';

const router = Router();

// Публичные маршруты
router.get('/levels', getAllLevels);
router.get('/levels/:code', getLevelByCode);

export default router;
