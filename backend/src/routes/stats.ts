import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';

const router = Router();

// Публичный маршрут
router.get('/', getStats);

export default router;
