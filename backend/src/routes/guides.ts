import { Router } from 'express';
import {
  getGuides,
  getGuide,
  createGuide,
  updateGuide,
  deleteGuide,
} from '../controllers/guideController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getGuides);
router.get('/:slug', getGuide);
router.post('/', authenticate, authorize('moderator', 'admin', 'founder'), createGuide);
router.put('/:slug', authenticate, authorize('moderator', 'admin', 'founder'), updateGuide);
router.delete('/:slug', authenticate, authorize('admin', 'founder'), deleteGuide);

export default router;
