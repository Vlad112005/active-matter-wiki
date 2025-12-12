import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/items';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getItems);
router.get('/:id', getItem);

// Protected
router.post('/', authenticate, requireRole(['admin', 'founder']), createItem);
router.put('/:id', authenticate, requireRole(['admin', 'founder']), updateItem);
router.delete('/:id', authenticate, requireRole(['founder']), deleteItem);

export default router;
