import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// Получить общую статистику
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [itemsCount, locationsCount, guidesCount, patchesCount, usersCount] = await Promise.all([
      prisma.item.count(),
      prisma.location.count(),
      prisma.guide.count({ where: { published: true } }),
      prisma.patch.count(),
      prisma.user.count(),
    ]);

    // Последнее обновление игры (последний патч)
    const latestPatch = await prisma.patch.findFirst({
      orderBy: { releaseDate: 'desc' },
      select: { releaseDate: true, version: true },
    });

    // Последнее обновление сайта (последний созданный предмет/гайд/локация)
    const latestUpdates = await Promise.all([
      prisma.item.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      prisma.guide.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      prisma.location.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    ]);

    const latestSiteUpdate = latestUpdates
      .filter((u) => u !== null)
      .map((u) => u!.createdAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    return res.json({
      success: true,
      data: {
        items: itemsCount,
        locations: locationsCount,
        guides: guidesCount,
        patches: patchesCount,
        users: usersCount,
        lastGameUpdate: latestPatch?.releaseDate,
        lastGameVersion: latestPatch?.version,
        lastSiteUpdate: latestSiteUpdate,
      },
    });
  } catch (error: any) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};
