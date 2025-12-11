import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// Получить все уровни монолита
export const getAllLevels = async (req: AuthRequest, res: Response) => {
  try {
    const levels = await prisma.monolithLevel.findMany({
      include: {
        unlocks: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return res.json({
      success: true,
      data: levels,
    });
  } catch (error: any) {
    console.error('getAllLevels error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить конкретный уровень
export const getLevelByCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.params;

    const level = await prisma.monolithLevel.findUnique({
      where: { code },
      include: {
        unlocks: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!level) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Уровень не найден' },
      });
    }

    return res.json({
      success: true,
      data: level,
    });
  } catch (error: any) {
    console.error('getLevelByCode error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};
