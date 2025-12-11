import { Router } from 'express';
import { discordCallback } from '../controllers/authController.js';

const router = Router();

router.get('/callback', discordCallback);

export default router;
