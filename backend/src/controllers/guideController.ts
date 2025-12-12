import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// ===== ГАЙДЫ =====

// Получить все нарубликованные гайды
export const getPublishedGuides = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = 'desc', tag } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { published: true };
    if (tag) {
      where.tags = { has: String(tag) };
    }

    const [guides, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        include: { author: true },
        orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.guide.count({ where }),
    ]);

    return res.json({
      success: true,
      data: guides,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        perPage: limitNum,
        total: total,
      },
    });
  } catch (error: any) {
    console.error('getPublishedGuides error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить гайд по slug
export const getGuideBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Гайд не найден' },
      });
    }

    // Повысим счётчик просмотров
    if (guide.published) {
      await prisma.guide.update({
        where: { id: guide.id },
        data: { views: { increment: 1 } },
      });
    }

    return res.json({ success: true, data: guide });
  } catch (error: any) {
    console.error('getGuideBySlug error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Создать гайд (admin/moderator)
export const createGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { title, titleEn, slug, content, contentEn, tags, published } = req.body;

    if (req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    const guide = await prisma.guide.create({
      data: {
        title,
        titleEn,
        slug,
        content,
        contentEn,
        tags,
        published,
        authorId: req.user!.id,
      },
      include: { author: true },
    });

    return res.status(201).json({ success: true, data: guide });
  } catch (error: any) {
    console.error('createGuide error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить гайд
export const updateGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, titleEn, content, contentEn, tags, published } = req.body;

    const guide = await prisma.guide.findUnique({ where: { id } });
    if (!guide) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Гайд не найден' },
      });
    }

    if (guide.authorId !== req.user?.id && req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    const updated = await prisma.guide.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(titleEn && { titleEn }),
        ...(content && { content }),
        ...(contentEn && { contentEn }),
        ...(tags && { tags }),
        ...(published !== undefined && { published }),
      },
      include: { author: true },
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('updateGuide error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить гайд
export const deleteGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const guide = await prisma.guide.findUnique({ where: { id } });
    if (!guide) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Гайд не найден' },
      });
    }

    if (guide.authorId !== req.user?.id && req.user?.role?.name !== 'admin' && req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Нет доступа' },
      });
    }

    await prisma.guide.delete({ where: { id } });

    return res.json({ success: true, message: 'Гайд удалён' });
  } catch (error: any) {
    console.error('deleteGuide error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};
