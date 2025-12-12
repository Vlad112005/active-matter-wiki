import { Router } from 'express';
import { getAllLevels, getLevelByCode } from '../controllers/monolith';

const router = Router();

router.get('/', getAllLevels);
router.get('/:code', getLevelByCode);

export default router;
