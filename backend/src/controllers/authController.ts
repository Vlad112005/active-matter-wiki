import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Все поля обязательны' },
      });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'Пользователь с таким email или username уже существует',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!userRole) {
      return res.status(500).json({
        success: false,
        error: { code: 'ROLE_NOT_FOUND', message: 'Роль пользователя не найдена' },
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        roleId: userRole.id,
      },
      include: {
        role: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          isPremium: user.isPremium,
          premiumUntil: user.premiumUntil,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'REGISTER_FAILED', message: error.message },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Все поля обязательны' },
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
      include: {
        role: true,
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверный логин или пароль' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Неверный логин или пароль' },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          isPremium: user.isPremium,
          premiumUntil: user.premiumUntil,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'LOGIN_FAILED', message: error.message },
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  return res.json({ success: true, message: 'Вы вышли из системы' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Пользователь не найден' },
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};
