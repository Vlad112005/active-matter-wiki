import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const user = await prisma.user.findUnique({
      where: { id: authReq.user!.id },
      include: {
        role: true,
        _count: {
          select: {
            guides: true,
            comments: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        role: user.role,
        stats: user._count,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { username, bio, avatar } = req.body;

    const updated = await prisma.user.update({
      where: { id: authReq.user!.id },
      data: { username, bio, avatar },
      include: { role: true },
    });

    res.json({
      success: true,
      data: {
        ...updated,
        password: undefined,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Username already taken' });
    }
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: authReq.user!.id } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: authReq.user!.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
};

export const getUserPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        isPremium: true,
        createdAt: true,
        role: { select: { displayName: true } },
        guides: {
          where: { published: true },
          select: { id: true, title: true, slug: true, views: true, rating: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { guides: true, comments: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
};
