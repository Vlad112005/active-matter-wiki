import { Router } from 'express';
import { getPublishedGuides, getGuideBySlug, createGuide, updateGuide, deleteGuide } from '../controllers/guideController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getPublishedGuides);
router.get('/:slug', getGuideBySlug);

// Protected (admin/founder)
router.post('/', authenticate, createGuide);
router.put('/:id', authenticate, updateGuide);
router.delete('/:id', authenticate, deleteGuide);

export default router;
