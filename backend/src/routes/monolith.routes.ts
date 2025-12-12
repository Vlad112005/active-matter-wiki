import { Router } from 'express';
import { getMonolithLevels, getMonolithLevelByCode } from '../controllers/monolith';

const router = Router();

router.get('/', getMonolithLevels);
router.get('/:code', getMonolithLevelByCode);

export default router;
