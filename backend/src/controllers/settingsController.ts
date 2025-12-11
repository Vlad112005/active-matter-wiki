import { Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// Получить все настройки (публичные)
export const getPublicSettings = async (req: AuthRequest, res: Response) => {
  try {
    const publicKeys = [
      'maintenance_mode',
      'maintenance_message',
      'game_version',
      'game_status',
      'site_version',
      'announcement',
    ];

    const settings = await prisma.siteSettings.findMany({
      where: {
        key: { in: publicKeys },
      },
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return res.json({ success: true, data: settingsMap });
  } catch (error: any) {
    console.error('getPublicSettings error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить все настройки (только для админов)
export const getAllSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findMany({
      orderBy: { key: 'asc' },
    });

    return res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('getAllSettings error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Обновить настройку
export const updateSetting = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Укажите key и value' },
      });
    }

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: {
        value,
        description,
        updatedBy: req.user!.id,
      },
      create: {
        key,
        value,
        description,
        updatedBy: req.user!.id,
      },
    });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_SETTING',
        entity: 'SiteSettings',
        entityId: setting.id,
        changes: { key, value },
      },
    });

    return res.json({ success: true, data: setting });
  } catch (error: any) {
    console.error('updateSetting error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить настройку
export const deleteSetting = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;

    await prisma.siteSettings.delete({
      where: { key },
    });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_SETTING',
        entity: 'SiteSettings',
        entityId: key,
      },
    });

    return res.json({ success: true, message: 'Настройка удалена' });
  } catch (error: any) {
    console.error('deleteSetting error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};
