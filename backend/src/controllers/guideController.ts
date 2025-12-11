import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

export const getGuides = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, category, published = 'true' } = req.query;

    const where: any = { published: published === 'true' };
    if (category) where.category = category;

    const total = await prisma.guide.count({ where });
    const guides = await prisma.guide.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, username: true } } },
    });

    return res.json({
      success: true,
      data: guides,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const getGuide = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: { author: { select: { id: true, username: true } } },
    });

    if (!guide) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Guide not found' } });
    }

    await prisma.guide.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return res.json({ success: true, data: guide });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const createGuide = async (req: AuthRequest, res: Response) => {
  try {
    const guide = await prisma.guide.create({
      data: {
        ...req.body,
        authorId: req.user!.id,
      },
      include: { author: { select: { id: true, username: true } } },
    });
    return res.status(201).json({ success: true, data: guide });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'CREATE_FAILED', message: error.message } });
  }
};

export const updateGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const guide = await prisma.guide.update({
      where: { slug },
      data: req.body,
      include: { author: { select: { id: true, username: true } } },
    });
    return res.json({ success: true, data: guide });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'UPDATE_FAILED', message: error.message } });
  }
};

export const deleteGuide = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    await prisma.guide.delete({ where: { slug } });
    return res.json({ success: true, message: 'Guide deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'DELETE_FAILED', message: error.message } });
  }
};
