import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Публичные маршруты
router.get('/', getItems);
router.get('/:id', getItem);

// Админ маршруты
router.post('/', authenticate, authorize('admin', 'founder'), createItem);
router.put('/:id', authenticate, authorize('admin', 'founder'), updateItem);
router.delete('/:id', authenticate, authorize('admin', 'founder'), deleteItem);

export default router;
