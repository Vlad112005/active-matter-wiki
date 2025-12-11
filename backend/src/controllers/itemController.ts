import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/client.js';
import { AppError, ItemFilters } from '../types/index.js';

// GET all items with filtering
export async function getItems(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      rarity,
      minPrice,
      maxPrice,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
    const skip = (pageNum - 1) * limitNum;

    // Build filters
    const where: any = {};

    if (type) where.type = String(type);
    if (rarity) where.rarity = String(rarity);
    if (minPrice) where.price = { gte: parseInt(String(minPrice)) };
    if (maxPrice) {
      where.price = { ...where.price, lte: parseInt(String(maxPrice)) };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { tags: { hasSome: [String(search)] } },
      ];
    }

    // Fetch items
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
      }),
      prisma.item.count({ where }),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET item by ID
export async function getItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        results: {
          include: {
            ingredients: {
              include: { item: true },
            },
          },
        },
      },
    });

    if (!item) {
      return next(new AppError(404, 'NOT_FOUND', `Item with id ${id} not found`));
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

// CREATE new item
export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, type, rarity, price, weight, stackable, source, tags } =
      req.body;

    // Validation
    if (!name || !description || !type || !rarity) {
      return next(
        new AppError(400, 'VALIDATION_ERROR', 'Missing required fields')
      );
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        type,
        rarity,
        price: price || 0,
        weight: weight || 0,
        stackable: stackable || false,
        source: source || [],
        tags: tags || [],
      },
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE item
export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if item exists
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return next(new AppError(404, 'NOT_FOUND', `Item with id ${id} not found`));
    }

    const item = await prisma.item.update({
      where: { id },
      data: updates,
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE item
export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    // Check if item exists
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return next(new AppError(404, 'NOT_FOUND', `Item with id ${id} not found`));
    }

    await prisma.item.delete({ where: { id } });

    res.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

// SEARCH items
export async function searchItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return next(
        new AppError(400, 'VALIDATION_ERROR', 'Search query required')
      );
    }

    const items = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: String(q), mode: 'insensitive' } },
          { description: { contains: String(q), mode: 'insensitive' } },
          { tags: { hasSome: [String(q)] } },
        ],
      },
      take: Math.min(parseInt(String(limit)), 50),
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
}
