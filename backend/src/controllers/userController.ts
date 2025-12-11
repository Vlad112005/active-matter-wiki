import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

// Получить список всех пользователей (только для admin+)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = { name: role };
    }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { role: true },
    });

    // Убираем password из ответа
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return res.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить конкретного пользователя
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        guides: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Пользователь не найден' },
      });
    }

    // Убираем password
    const { password, ...sanitizedUser } = user;

    return res.json({ success: true, data: sanitizedUser });
  } catch (error: any) {
    console.error('getUser error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Обновить профиль (свой)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio, avatar } = req.body;
    const userId = req.user!.id;

    // Проверка уникальности username
    if (username) {
      const existing = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: { code: 'USERNAME_TAKEN', message: 'Это имя пользователя уже занято' },
        });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      include: { role: true },
    });

    const { password, ...sanitizedUser } = user;

    return res.json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error: any) {
    console.error('updateProfile error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Изменить роль пользователя (только admin+)
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_ROLE', message: 'Укажите roleId' },
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { roleId },
      include: { role: true },
    });

    // Логирование действия
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_USER_ROLE',
        entity: 'User',
        entityId: id,
        changes: { roleId },
      },
    });

    const { password, ...sanitizedUser } = user;

    return res.json({ success: true, data: sanitizedUser });
  } catch (error: any) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить пользователя (только founder)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_USER',
        entity: 'User',
        entityId: id,
      },
    });

    return res.json({ success: true, message: 'Пользователь удалён' });
  } catch (error: any) {
    console.error('deleteUser error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};

// Получить все роли
export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    return res.json({ success: true, data: roles });
  } catch (error: any) {
    console.error('getRoles error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить статистику пользователей
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } });
    
    const usersByRole = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { role: true },
    });

    // Убираем password
    const sanitizedRecent = recentUsers.map(({ password, ...user }) => user);

    return res.json({
      success: true,
      data: {
        total: totalUsers,
        premium: premiumUsers,
        byRole: usersByRole.map((role) => ({
          role: role.name,
          displayName: role.displayName,
          count: role._count.users,
        })),
        recent: sanitizedRecent,
      },
    });
  } catch (error: any) {
    console.error('getUserStats error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};
