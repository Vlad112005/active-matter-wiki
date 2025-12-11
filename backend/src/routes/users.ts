import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  updateUserRole,
  deleteUser,
  getRoles,
  getUserStats,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Публичные маршруты
router.get('/:id', getUser); // Профиль пользователя

// Защищённые маршруты
router.put('/profile', authenticate, updateProfile); // Обновить свой профиль

// Админ маршруты
router.get('/', authenticate, authorize('admin', 'founder'), getUsers);
router.get('/stats/overview', authenticate, authorize('moderator', 'admin', 'founder'), getUserStats);
router.get('/roles/list', authenticate, authorize('admin', 'founder'), getRoles);
router.put('/:id/role', authenticate, authorize('admin', 'founder'), updateUserRole);
router.delete('/:id', authenticate, authorize('founder'), deleteUser);

export default router;
