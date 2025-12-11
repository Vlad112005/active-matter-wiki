import { Router } from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
} from '../controllers/itemController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getItems);
router.get('/search', searchItems);
router.get('/:id', getItem);

// Protected routes (admin only)
router.post('/', authenticate, authorize('admin', 'editor'), createItem);
router.put('/:id', authenticate, authorize('admin', 'editor'), updateItem);
router.delete('/:id', authenticate, authorize('admin'), deleteItem);

export default router;
