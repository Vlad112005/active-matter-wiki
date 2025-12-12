import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';
import toast from 'react-hot-toast';

// ===== НОВОСти / ПАТЧИ =====

// Получить все патчи (с пагинацией)
export const getPatches = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = 'desc' } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const [patches, total] = await Promise.all([
      prisma.patch.findMany({
        orderBy: { publishedAt: sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.patch.count(),
    ]);

    return res.json({
      success: true,
      data: patches,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        perPage: limitNum,
        total: total,
      },
    });
  } catch (error: any) {
    console.error('getPatches error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить один патч
export const getPatch = async (req: Request, res: Response) => {
  try {
    const { version } = req.params;

    const patch = await prisma.patch.findUnique({
      where: { version },
    });

    if (!patch) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Патч не найден' },
      });
    }

    return res.json({ success: true, data: patch });
  } catch (error: any) {
    console.error('getPatch error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Создать патч (admin/founder)
export const createPatch = async (req: AuthRequest, res: Response) => {
  try {
    const { version, title, titleEn, content, contentEn } = req.body;

    // Проверка прав
    if (req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    const patch = await prisma.patch.create({
      data: {
        version,
        title,
        titleEn,
        content,
        contentEn,
        publishedAt: new Date(),
      },
    });

    return res.status(201).json({ success: true, data: patch });
  } catch (error: any) {
    console.error('createPatch error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить патч
export const updatePatch = async (req: AuthRequest, res: Response) => {
  try {
    const { version } = req.params;
    const { title, titleEn, content, contentEn } = req.body;

    if (req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    const patch = await prisma.patch.update({
      where: { version },
      data: {
        ...(title && { title }),
        ...(titleEn && { titleEn }),
        ...(content && { content }),
        ...(contentEn && { contentEn }),
      },
    });

    return res.json({ success: true, data: patch });
  } catch (error: any) {
    console.error('updatePatch error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить патч
export const deletePatch = async (req: AuthRequest, res: Response) => {
  try {
    const { version } = req.params;

    if (req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    await prisma.patch.delete({ where: { version } });

    return res.json({ success: true, message: 'Патч удалён' });
  } catch (error: any) {
    console.error('deletePatch error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};
