import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// ===== УПРАВЛЕНИЕ МОНОЛИТОМ (ТОЛЬКО ДЛЯ ОСНОВАТЕЛЯ) =====

// Получить все уровни с разблокировками
export const getAllMonolithLevels = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const levels = await prisma.monolithLevel.findMany({
      orderBy: { order: 'asc' },
      include: {
        unlocks: {
          include: {
            item: true,
          },
        },
      },
    });

    return res.json({ success: true, data: levels });
  } catch (error: any) {
    console.error('getAllMonolithLevels error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить один уровень с деталями
export const getMonolithLevel = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { levelId } = req.params;

    const level = await prisma.monolithLevel.findUnique({
      where: { id: levelId },
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

    return res.json({ success: true, data: level });
  } catch (error: any) {
    console.error('getMonolithLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Создать уровень
export const createMonolithLevel = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { code, order, name, nameEn, requiredTokens, requiredCrystals } = req.body;

    const level = await prisma.monolithLevel.create({
      data: {
        code,
        order,
        name,
        nameEn,
        requiredTokens,
        requiredCrystals,
      },
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE_MONOLITH_LEVEL',
        entity: 'MonolithLevel',
        entityId: level.id,
        changes: { code, order, name },
      },
    });

    return res.status(201).json({ success: true, data: level });
  } catch (error: any) {
    console.error('createMonolithLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить уровень
export const updateMonolithLevel = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { levelId } = req.params;
    const { name, nameEn, requiredTokens, requiredCrystals } = req.body;

    const level = await prisma.monolithLevel.update({
      where: { id: levelId },
      data: {
        ...(name && { name }),
        ...(nameEn && { nameEn }),
        ...(requiredTokens !== undefined && { requiredTokens }),
        ...(requiredCrystals !== undefined && { requiredCrystals }),
      },
      include: { unlocks: true },
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_MONOLITH_LEVEL',
        entity: 'MonolithLevel',
        entityId: level.id,
        changes: { name, requiredTokens, requiredCrystals },
      },
    });

    return res.json({ success: true, data: level });
  } catch (error: any) {
    console.error('updateMonolithLevel error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Добавить разблокировку (предмет, крафт, апгрейд, хроно)
export const addMonolithUnlock = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { levelId } = req.params;
    const { type, itemId, upgradeName, upgradeNameEn, upgradeCost, recipeName, recipeNameEn, chronoName, chronoNameEn, isLocked } = req.body;

    // type: 'item', 'upgrade', 'recipe', 'chrono'
    const unlock = await prisma.monolithUnlock.create({
      data: {
        monolithLevelId: levelId,
        type,
        itemId: itemId || null,
        upgradeName: upgradeName || null,
        upgradeNameEn: upgradeNameEn || null,
        upgradeCost: upgradeCost || null,
        recipeName: recipeName || null,
        recipeNameEn: recipeNameEn || null,
        chronoName: chronoName || null,
        chronoNameEn: chronoNameEn || null,
        isLocked: isLocked || false,
      },
      include: { item: true },
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'ADD_MONOLITH_UNLOCK',
        entity: 'MonolithUnlock',
        entityId: unlock.id,
        changes: { type, itemId, upgradeName },
      },
    });

    return res.status(201).json({ success: true, data: unlock });
  } catch (error: any) {
    console.error('addMonolithUnlock error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить разблокировку
export const updateMonolithUnlock = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { unlockId } = req.params;
    const { upgradeName, upgradeNameEn, upgradeCost, recipeName, recipeNameEn, chronoName, chronoNameEn, isLocked } = req.body;

    const unlock = await prisma.monolithUnlock.update({
      where: { id: unlockId },
      data: {
        ...(upgradeName && { upgradeName }),
        ...(upgradeNameEn && { upgradeNameEn }),
        ...(upgradeCost !== undefined && { upgradeCost }),
        ...(recipeName && { recipeName }),
        ...(recipeNameEn && { recipeNameEn }),
        ...(chronoName && { chronoName }),
        ...(chronoNameEn && { chronoNameEn }),
        ...(isLocked !== undefined && { isLocked }),
      },
      include: { item: true },
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_MONOLITH_UNLOCK',
        entity: 'MonolithUnlock',
        entityId: unlock.id,
        changes: { upgradeName, isLocked },
      },
    });

    return res.json({ success: true, data: unlock });
  } catch (error: any) {
    console.error('updateMonolithUnlock error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить разблокировку
export const deleteMonolithUnlock = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { unlockId } = req.params;

    await prisma.monolithUnlock.delete({
      where: { id: unlockId },
    });

    // Логирование
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_MONOLITH_UNLOCK',
        entity: 'MonolithUnlock',
        entityId: unlockId,
      },
    });

    return res.json({ success: true, message: 'Разблокировка удалена' });
  } catch (error: any) {
    console.error('deleteMonolithUnlock error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};
