import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q, type, limit = 10 } = req.query;

    if (!q || String(q).length < 2) {
      return res.status(400).json({ success: false, error: 'Query too short (min 2 chars)' });
    }

    const query = String(q).toLowerCase();
    const maxResults = Math.min(Number(limit), 50);

    const results: any = {
      items: [],
      guides: [],
      locations: [],
      patches: [],
    };

    // Search Items
    if (!type || type === 'items') {
      results.items = await prisma.item.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
          isPublished: true,
        },
        take: maxResults,
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          rarity: true,
          image: true,
        },
      });
    }

    // Search Guides
    if (!type || type === 'guides') {
      results.guides = await prisma.guide.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
          published: true,
        },
        take: maxResults,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          category: true,
          views: true,
          rating: true,
          author: { select: { username: true } },
        },
      });
    }

    // Search Locations
    if (!type || type === 'locations') {
      results.locations = await prisma.location.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          isPublished: true,
        },
        take: maxResults,
        select: {
          id: true,
          name: true,
          description: true,
          dangerLevel: true,
          image: true,
        },
      });
    }

    // Search Patches
    if (!type || type === 'patches') {
      results.patches = await prisma.patch.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
          published: true,
        },
        take: maxResults,
        select: {
          id: true,
          version: true,
          title: true,
          publishedAt: true,
        },
      });
    }

    const totalResults = 
      results.items.length + 
      results.guides.length + 
      results.locations.length + 
      results.patches.length;

    res.json({
      success: true,
      query: q,
      total: totalResults,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};
