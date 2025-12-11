import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../database/client.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../types/index.js';

// LOGIN
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return next(
        new AppError(400, 'VALIDATION_ERROR', 'Username and password required')
      );
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return next(
        new AppError(401, 'UNAUTHORIZED', 'Invalid username or password')
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return next(
        new AppError(401, 'UNAUTHORIZED', 'Invalid username or password')
      );
    }

    // Generate token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    res.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  } catch (error) {
    next(error);
  }
}

// REGISTER (admin only)
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password, role = 'editor' } = req.body;

    // Validation
    if (!username || !email || !password) {
      return next(
        new AppError(400, 'VALIDATION_ERROR', 'Missing required fields')
      );
    }

    // Check if user exists
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      return next(
        new AppError(409, 'CONFLICT', 'Username or email already exists')
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Generate token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      token,
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  } catch (error) {
    next(error);
  }
}

// LOGOUT
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // In a real app, you might invalidate the token in Redis or database
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

// GET current user
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return next(new AppError(404, 'NOT_FOUND', 'User not found'));
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}
