import { Router } from 'express';
import { getPatches, getPatch, createPatch, updatePatch, deletePatch } from '../controllers/patches';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getPatches);
router.get('/:id', getPatch);

// Protected (использовать только если есть в контроллере)
// router.post('/', authenticate, requireRole(['admin', 'founder']), createPatch);
// router.put('/:id', authenticate, requireRole(['admin', 'founder']), updatePatch);
// router.delete('/:id', authenticate, requireRole(['founder']), deletePatch);

export default router;
