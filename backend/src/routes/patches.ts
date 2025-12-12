import { Router } from 'express';
import { getPatches, getPatch, createPatch, updatePatch, deletePatch } from '../controllers/patchController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getPatches);
router.get('/:version', getPatch);

// Protected (admin/founder)
router.post('/', authenticate, createPatch);
router.put('/:version', authenticate, updatePatch);
router.delete('/:version', authenticate, deletePatch);

export default router;
