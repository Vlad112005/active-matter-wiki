import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPatches = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await prisma.patch.count();
    const patches = await prisma.patch.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { releaseDate: 'desc' },
      include: { changes: true },
    });

    return res.json({
      success: true,
      data: patches,
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

export const getPatch = async (req: Request, res: Response) => {
  try {
    const { version } = req.params;
    const patch = await prisma.patch.findUnique({
      where: { version },
      include: { changes: true },
    });

    if (!patch) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Patch not found' } });
    }

    return res.json({ success: true, data: patch });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const createPatch = async (req: AuthRequest, res: Response) => {
  try {
    const patch = await prisma.patch.create({
      data: req.body,
      include: { changes: true },
    });
    return res.status(201).json({ success: true, data: patch });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'CREATE_FAILED', message: error.message } });
  }
};

export const updatePatch = async (req: AuthRequest, res: Response) => {
  try {
    const { version } = req.params;
    const patch = await prisma.patch.update({
      where: { version },
      data: req.body,
      include: { changes: true },
    });
    return res.json({ success: true, data: patch });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'UPDATE_FAILED', message: error.message } });
  }
};

export const deletePatch = async (req: AuthRequest, res: Response) => {
  try {
    const { version } = req.params;
    await prisma.patch.delete({ where: { version } });
    return res.json({ success: true, message: 'Patch deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'DELETE_FAILED', message: error.message } });
  }
};
