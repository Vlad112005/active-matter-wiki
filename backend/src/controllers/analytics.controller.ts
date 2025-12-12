import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [users, items, guides, patches, activities] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.guide.count(),
      prisma.patch.count(),
      prisma.activityLog.count(),
    ]);

    const recentActivity = await prisma.activityLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, email: true } } },
    });

    const topUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { loginCount: 'desc' },
      select: { id: true, username: true, email: true, loginCount: true, lastLoginAt: true },
    });

    const popularItems = await prisma.item.findMany({
      take: 10,
      orderBy: { viewCount: 'desc' },
      select: { id: true, name: true, viewCount: true, type: true, rarity: true },
    });

    res.json({
      success: true,
      data: {
        stats: { users, items, guides, patches, activities },
        recentActivity,
        topUsers,
        popularItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Analytics fetch failed' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } });
    const verifiedUsers = await prisma.user.count({ where: { emailVerified: true } });

    const usersByRole = await prisma.role.findMany({
      include: { _count: { select: { users: true } } },
    });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        premium: premiumUsers,
        verified: verifiedUsers,
        byRole: usersByRole.map(role => ({
          role: role.name,
          displayName: role.displayName,
          count: role._count.users,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'User stats fetch failed' });
  }
};
