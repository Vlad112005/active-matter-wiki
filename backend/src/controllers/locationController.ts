import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, difficulty } = req.query;

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;

    const total = await prisma.location.count({ where });
    const locations = await prisma.location.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { name: 'asc' },
    });

    return res.json({
      success: true,
      data: locations,
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

export const getLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        enemies: true,
        lootTable: { include: { item: true } },
      },
    });

    if (!location) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Location not found' } });
    }

    return res.json({ success: true, data: location });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const createLocation = async (req: AuthRequest, res: Response) => {
  try {
    const location = await prisma.location.create({ data: req.body });
    return res.status(201).json({ success: true, data: location });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'CREATE_FAILED', message: error.message } });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, data: location });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'UPDATE_FAILED', message: error.message } });
  }
};

export const deleteLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.location.delete({ where: { id } });
    return res.json({ success: true, message: 'Location deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'DELETE_FAILED', message: error.message } });
  }
};
