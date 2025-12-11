import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

/**
 * Middleware для проверки роли пользователя
 * @param allowedRoles - массив разрешённых ролей
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Требуется авторизация',
        },
      });
    }

    const userRole = req.user.role?.name;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Недостаточно прав доступа',
        },
      });
    }

    next();
  };
};

/**
 * Middleware для проверки на администратора
 */
export const requireAdmin = requireRole(['admin', 'founder']);

/**
 * Middleware для проверки на модератора или выше
 */
export const requireModerator = requireRole(['moderator', 'admin', 'founder']);
