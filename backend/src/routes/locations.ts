import { Router } from 'express';
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getLocations);
router.get('/:id', getLocation);
router.post('/', authenticate, authorize('admin', 'founder'), createLocation);
router.put('/:id', authenticate, authorize('admin', 'founder'), updateLocation);
router.delete('/:id', authenticate, authorize('founder'), deleteLocation);

export default router;
