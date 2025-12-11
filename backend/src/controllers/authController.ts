import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'Email or username already exists' },
      });
    }

    const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!userRole) {
      return res.status(500).json({ success: false, error: { code: 'ROLE_NOT_FOUND', message: 'Default role not found' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        roleId: userRole.id,
      },
      include: { role: true },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role.name,
        },
        token,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'REGISTRATION_FAILED', message: error.message } });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: username }, { username }] },
      include: { role: true },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role.name,
          isPremium: user.isPremium,
        },
        token,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'LOGIN_FAILED', message: error.message } });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'FETCH_FAILED', message: error.message } });
  }
};

export const discordCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ success: false, error: { code: 'NO_CODE', message: 'No authorization code' } });
    }

    // Exchange code for Discord token (implement Discord OAuth2 flow)
    // For now, returning placeholder
    return res.json({ success: true, message: 'Discord OAuth not fully implemented yet' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'DISCORD_AUTH_FAILED', message: error.message } });
  }
};
