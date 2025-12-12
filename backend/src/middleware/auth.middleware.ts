import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role?: { name: string; priority: number; permissions: any };
  };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid token or inactive user' });
    }

    (req as AuthRequest).user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role ? {
        name: user.role.name,
        priority: user.role.priority,
        permissions: user.role.permissions,
      } : undefined,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user?.role || !roles.includes(authReq.user.role.name)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireFounder = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role?.name !== 'founder') {
    return res.status(403).json({ success: false, error: 'Founder access required' });
  }
  next();
};
