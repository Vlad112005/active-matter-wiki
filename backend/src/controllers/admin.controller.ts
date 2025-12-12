import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';

// USER MANAGEMENT
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (role) where.role = { name: role };
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          role: true,
          _count: { select: { guides: true, comments: true, favorites: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users.map(u => ({
        ...u,
        password: undefined,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, roleId, isActive, isPremium, bio, avatar } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        roleId,
        isActive,
        isPremium,
        bio,
        avatar,
      },
      include: { role: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_USER',
        entity: 'User',
        entityId: id,
        changes: { before: req.body, after: updated },
      },
    });

    res.json({ success: true, data: { ...updated, password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user!.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete yourself' });
    }

    await prisma.user.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_USER',
        entity: 'User',
        entityId: id,
      },
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
};

// ACTIVITY LOGS
export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, action, entity, userId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: Number(limit),
        include: { user: { select: { username: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch activity logs' });
  }
};

// SETTINGS MANAGEMENT
export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });

    // Group by category
    const grouped = settings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) acc[setting.category] = [];
      acc[setting.category].push(setting);
      return acc;
    }, {});

    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // Check access level
    const setting = await prisma.siteSettings.findUnique({ where: { key } });
    if (!setting) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    // Only founder can edit founder-level settings
    if (setting.accessLevel === 'founder' && req.user!.role?.name !== 'founder') {
      return res.status(403).json({ success: false, error: 'Founder access required' });
    }

    const updated = await prisma.siteSettings.update({
      where: { key },
      data: { value, updatedBy: req.user!.id },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_SETTING',
        entity: 'SiteSettings',
        entityId: key,
        changes: { key, oldValue: setting.value, newValue: value },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update setting' });
  }
};
