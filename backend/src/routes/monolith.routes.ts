import { Router } from 'express';
import { getMonolithLevels, getMonolithLevel } from '../controllers/monolith';

const router = Router();

router.get('/', getMonolithLevels);
router.get('/:code', getMonolithLevel);

export default router;
