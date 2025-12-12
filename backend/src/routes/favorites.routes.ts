import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as favoritesController from '../controllers/favorites.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', favoritesController.getFavorites);
router.get('/check', favoritesController.checkFavorite);
router.post('/', favoritesController.addFavorite);
router.delete('/:id', favoritesController.removeFavorite);

export default router;
