import { Router } from 'express';

const router = Router();

// Discord OAuth placeholder - будет реализовано позже
router.get('/auth', (req, res) => {
  res.json({
    success: false,
    message: 'Discord OAuth пока не реализован. Используйте обычную регистрацию.',
  });
});

router.get('/callback', (req, res) => {
  res.json({
    success: false,
    message: 'Discord OAuth пока не реализован.',
  });
});

export default router;
