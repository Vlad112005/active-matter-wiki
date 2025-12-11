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

// Создать новый уровень
export const createLevel = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;

    const level = await prisma.monolithLevel.create({
      data: {
        code: data.code,
        order: data.order,
        name: data.name,
        nameEn: data.nameEn,
        requiredTokens: data.requiredTokens || null,
        requiredCredits: data.requiredCredits || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: level,
    });
  } catch (error: any) {
    console.error('createLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить уровень
export const updateLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const level = await prisma.monolithLevel.update({
      where: { id },
      data: {
        code: data.code,
        order: data.order,
        name: data.name,
        nameEn: data.nameEn,
        requiredTokens: data.requiredTokens || null,
        requiredCredits: data.requiredCredits || null,
      },
    });

    return res.json({
      success: true,
      data: level,
    });
  } catch (error: any) {
    console.error('updateLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить уровень
export const deleteLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.monolithLevel.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Уровень удалён',
    });
  } catch (error: any) {
    console.error('deleteLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};

// Переместить уровень
export const moveLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    const level = await prisma.monolithLevel.findUnique({ where: { id } });
    if (!level) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Уровень не найден' },
      });
    }

    const newOrder = direction === 'up' ? level.order - 1 : level.order + 1;

    // Найти уровень с которым меняемся местами
    const swapLevel = await prisma.monolithLevel.findFirst({
      where: { order: newOrder },
    });

    if (swapLevel) {
      // Меняем порядок
      await prisma.monolithLevel.update({
        where: { id: swapLevel.id },
        data: { order: level.order },
      });
    }

    await prisma.monolithLevel.update({
      where: { id },
      data: { order: newOrder },
    });

    return res.json({
      success: true,
      message: 'Порядок обновлён',
    });
  } catch (error: any) {
    console.error('moveLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'MOVE_FAILED', message: error.message },
    });
  }
};
