import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { type } = req.query; // 'item', 'guide', 'location'

    const where: any = { userId: authReq.user!.id };
    if (type) where.type = type;

    const favorites = await prisma.favorite.findMany({
      where,
      include: {
        item: type === 'item' || !type ? true : false,
        guide: type === 'guide' || !type ? true : false,
        location: type === 'location' || !type ? true : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { type, itemId, guideId, locationId } = req.body;

    if (!['item', 'guide', 'location'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid favorite type' });
    }

    const data: any = {
      userId: authReq.user!.id,
      type,
    };

    if (type === 'item' && itemId) data.itemId = itemId;
    else if (type === 'guide' && guideId) data.guideId = guideId;
    else if (type === 'location' && locationId) data.locationId = locationId;
    else {
      return res.status(400).json({ success: false, error: 'Missing entity ID' });
    }

    const favorite = await prisma.favorite.create({ data });

    res.json({ success: true, data: favorite });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Already in favorites' });
    }
    res.status(500).json({ success: false, error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const favorite = await prisma.favorite.findFirst({
      where: { id, userId: authReq.user!.id },
    });

    if (!favorite) {
      return res.status(404).json({ success: false, error: 'Favorite not found' });
    }

    await prisma.favorite.delete({ where: { id } });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove favorite' });
  }
};

export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { type, entityId } = req.query;

    if (!type || !entityId) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    const where: any = { userId: authReq.user!.id, type };
    if (type === 'item') where.itemId = entityId;
    else if (type === 'guide') where.guideId = entityId;
    else if (type === 'location') where.locationId = entityId;

    const favorite = await prisma.favorite.findFirst({ where });

    res.json({ success: true, data: { isFavorite: !!favorite, favoriteId: favorite?.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check favorite' });
  }
};
