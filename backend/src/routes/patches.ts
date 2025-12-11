import { Router } from 'express';
import {
  getPatches,
  getPatch,
  createPatch,
  updatePatch,
  deletePatch,
} from '../controllers/patchController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getPatches);
router.get('/:version', getPatch);
router.post('/', authenticate, authorize('admin', 'founder'), createPatch);
router.put('/:version', authenticate, authorize('admin', 'founder'), updatePatch);
router.delete('/:version', authenticate, authorize('founder'), deletePatch);

export default router;
