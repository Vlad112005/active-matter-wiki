import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
    isPremium: boolean;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'Authentication required' } });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'User not found' } });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role.name,
      isPremium: user.isPremium,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'NOT_AUTHENTICATED', message: 'Authentication required' } });
    }

    const roleHierarchy = ['user', 'premium', 'moderator', 'admin', 'founder'];
    const userRoleIndex = roleHierarchy.indexOf(req.user.role);
    const hasPermission = allowedRoles.some(role => {
      const allowedRoleIndex = roleHierarchy.indexOf(role);
      return userRoleIndex >= allowedRoleIndex;
    });

    if (!hasPermission) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }

    next();
  };
};

export const requirePremium = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { code: 'NOT_AUTHENTICATED', message: 'Authentication required' } });
  }

  if (!req.user.isPremium && req.user.role === 'user') {
    return res.status(403).json({ success: false, error: { code: 'PREMIUM_REQUIRED', message: 'Premium subscription required' } });
  }

  next();
};
