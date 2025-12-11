import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header')
    );
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
  }

  req.user = payload;
  next();
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(401, 'UNAUTHORIZED', 'Authentication required')
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'FORBIDDEN',
          `This action requires one of: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
}
