import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// ===== АНАЛИТИКА ДЛЯ founder =====

// Получить дашборд метрик
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Проверка founder
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const [itemCount, patchCount, guideCount, userCount, locationCount, totalViews] = await Promise.all([
      prisma.item.count(),
      prisma.patch.count(),
      prisma.guide.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.location.count(),
      prisma.guide.aggregate({
        _sum: { views: true },
      }),
    ]);

    const topGuides = await prisma.guide.findMany({
      where: { published: true },
      orderBy: { views: 'desc' },
      take: 5,
      include: { author: true },
    });

    const userStats = await prisma.user.groupBy({
      by: ['roleId'],
      _count: true,
    });

    return res.json({
      success: true,
      data: {
        overview: {
          items: itemCount,
          patches: patchCount,
          guides: guideCount,
          users: userCount,
          locations: locationCount,
          totalViews: totalViews._sum.views || 0,
        },
        topGuides,
        userStats,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('getDashboard error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить логи активности
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { page = 1, limit = 50, action, entity } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (action) where.action = String(action);
    if (entity) where.entity = String(entity);

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return res.json({
      success: true,
      data: logs,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        perPage: limitNum,
        total: total,
      },
    });
  } catch (error: any) {
    console.error('getActivityLogs error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить статистику роста (графики)
export const getGrowthStats = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role?.name !== 'founder') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Только Основатель' },
      });
    }

    const { days = 30 } = req.query;
    const daysNum = Math.min(365, Math.max(1, parseInt(String(days))));
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysNum);

    const itemGrowth = await prisma.item.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: { gte: fromDate },
      },
    });

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: { gte: fromDate },
      },
    });

    const guideGrowth = await prisma.guide.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: { gte: fromDate },
        published: true,
      },
    });

    return res.json({
      success: true,
      data: {
        itemGrowth,
        userGrowth,
        guideGrowth,
        period: { days: daysNum, from: fromDate },
      },
    });
  } catch (error: any) {
    console.error('getGrowthStats error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};
