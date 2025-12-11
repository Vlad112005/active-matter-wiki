import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

export const getItems = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, type, rarity, search } = req.query;

    const where: any = {};
    if (type) where.type = type;
    if (rarity) where.rarity = rarity;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.item.count({ where });
    const items = await prisma.item.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: items,
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

export const getItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }

    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const searchItems = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;

    const items = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { tags: { hasSome: [q as string] } },
        ],
      },
      take: Number(limit),
    });

    return res.json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SEARCH_FAILED', message: error.message } });
  }
};

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await prisma.item.create({ data: req.body });
    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'CREATE_FAILED', message: error.message } });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, data: item });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'UPDATE_FAILED', message: error.message } });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({ where: { id } });
    return res.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'DELETE_FAILED', message: error.message } });
  }
};
