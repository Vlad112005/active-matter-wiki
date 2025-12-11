import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    // Получаем количество записей
    const [itemCount, patchCount, guideCount, locationCount, userCount] = await Promise.all([
      prisma.item.count(),
      prisma.patch.count(),
      prisma.guide.count({ where: { published: true } }),
      prisma.location.count(),
      prisma.user.count(),
    ]);

    // Последнее обновление игры (последний патч)
    const latestPatch = await prisma.patch.findFirst({
      orderBy: {
        publishedAt: 'desc',
      },
      select: {
        publishedAt: true,
        version: true,
      },
    });

    return res.json({
      success: true,
      data: {
        items: itemCount,
        patches: patchCount,
        guides: guideCount,
        locations: locationCount,
        users: userCount,
        lastUpdate: latestPatch?.publishedAt || new Date(),
        gameVersion: latestPatch?.version || '0.8.5',
      },
    });
  } catch (error: any) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error.message,
      },
    });
  }
};
