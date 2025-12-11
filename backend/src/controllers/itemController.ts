import { Request, Response } from 'express';
import { prisma } from '../database/client.js';
import { AuthRequest } from '../middleware/auth.js';

// Получить все предметы
export const getItems = async (req: Request, res: Response) => {
  try {
    const { search, type, rarity, limit } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (rarity) where.rarity = rarity;

    const items = await prisma.item.findMany({
      where,
      orderBy: { name: 'asc' },
      ...(limit && { take: Number(limit) }),
    });

    return res.json({ success: true, data: items });
  } catch (error: any) {
    console.error('getItems error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Получить один предмет
export const getItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        lootSpawns: {
          include: {
            location: true,
          },
        },
        craftIngredients: {
          include: {
            recipe: {
              include: {
                result: true,
              },
            },
          },
        },
        craftResults: {
          include: {
            ingredients: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Предмет не найден' },
      });
    }

    return res.json({ success: true, data: item });
  } catch (error: any) {
    console.error('getItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'FETCH_FAILED', message: error.message },
    });
  }
};

// Создать предмет (admin)
export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;

    const item = await prisma.item.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        type: data.type,
        rarity: data.rarity,
        price: data.price || 0,
        silverPrice: data.silverPrice,
        replicationPoints: data.replicationPoints,
        monolithLevel: data.monolithLevel,
        weight: data.weight || 0,
        stackable: data.stackable || false,
        maxStack: data.maxStack || 1,
        source: data.source || [],
        tags: data.tags || [],
        isQuestItem: data.isQuestItem || false,
        damage: data.damage,
        armor: data.armor,
        durability: data.durability,
      },
    });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE_ITEM',
        entity: 'Item',
        entityId: item.id,
        changes: data,
      },
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    console.error('createItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'CREATE_FAILED', message: error.message },
    });
  }
};

// Обновить предмет (admin)
export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.type && { type: data.type }),
        ...(data.rarity && { rarity: data.rarity }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.silverPrice !== undefined && { silverPrice: data.silverPrice }),
        ...(data.replicationPoints !== undefined && { replicationPoints: data.replicationPoints }),
        ...(data.monolithLevel !== undefined && { monolithLevel: data.monolithLevel }),
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.stackable !== undefined && { stackable: data.stackable }),
        ...(data.maxStack !== undefined && { maxStack: data.maxStack }),
        ...(data.source && { source: data.source }),
        ...(data.tags && { tags: data.tags }),
        ...(data.isQuestItem !== undefined && { isQuestItem: data.isQuestItem }),
        ...(data.damage !== undefined && { damage: data.damage }),
        ...(data.armor !== undefined && { armor: data.armor }),
        ...(data.durability !== undefined && { durability: data.durability }),
      },
    });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_ITEM',
        entity: 'Item',
        entityId: item.id,
        changes: data,
      },
    });

    return res.json({ success: true, data: item });
  } catch (error: any) {
    console.error('updateItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'UPDATE_FAILED', message: error.message },
    });
  }
};

// Удалить предмет (admin)
export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.item.delete({ where: { id } });

    // Логирование
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_ITEM',
        entity: 'Item',
        entityId: id,
      },
    });

    return res.json({ success: true, message: 'Предмет удалён' });
  } catch (error: any) {
    console.error('deleteItem error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message },
    });
  }
};
