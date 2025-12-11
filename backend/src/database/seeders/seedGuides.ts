import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const founderRole = await prisma.role.findUnique({ where: { name: 'founder' } });
  if (!founderRole) {
    console.error('Founder role not found. Please run seedRoles first.');
    return;
  }

  let author = await prisma.user.findFirst({
    where: { email: 'founder@activematter.wiki' },
  });

  if (!author) {
    author = await prisma.user.create({
      data: {
        email: 'founder@activematter.wiki',
        username: 'Founder',
        passwordHash: '$2b$10$dummyhashforadminuser',
        roleId: founderRole.id,
      },
    });
  }

  const guides = [
    {
      slug: 'beginners-guide',
      title: 'Beginner\'s Guide to Active Matter',
      content: `Welcome to Active Matter! This guide will help you survive your first raids.\n\n## Getting Started\n\n1. **Understand the Loop**: You\'re stuck in a time loop. Every death resets you.\n2. **Choose Your Loadout**: Start with basic weapons like MP5 or M4A1.\n3. **Learn the Maps**: Factory and Scrapyard are beginner-friendly.\n\n## Key Tips\n\n- Always bring medical supplies\n- Extract before the zone collapses\n- Active Matter is the most valuable resource\n- Watch for other players and AI enemies\n\n## Progression\n\nComplete missions to unlock better gear and access to harder raids.`,
      category: 'Beginner',
      tags: ['beginner', 'tutorial', 'basics'],
      authorId: author.id,
      published: true,
      featured: true,
      rating: 4.8,
      views: 15420,
      likes: 892,
    },
    {
      slug: 'best-weapons-ranked',
      title: 'Best Weapons Ranked for 2025',
      content: `Here\'s the definitive ranking of weapons in Active Matter.\n\n## S-Tier\n\n1. **M4A1** - Best all-around assault rifle\n2. **SPAS-12** - Devastating in close quarters\n3. **SV-98** - Unmatched long-range precision\n\n## A-Tier\n\n1. **AK-103** - Reliable and powerful\n2. **MP5** - Excellent SMG for close combat\n3. **Scorpion EVO 3** - High fire rate\n\n## B-Tier\n\nGood weapons but situational. Include SCAR-L, MB590, and others.`,
      category: 'Weapons',
      tags: ['weapons', 'tier-list', 'meta'],
      authorId: author.id,
      published: true,
      featured: true,
      rating: 4.6,
      views: 22100,
      likes: 1203,
    },
    {
      slug: 'headquarters-map-guide',
      title: 'Headquarters Map Guide - Full Walkthrough',
      content: `Headquarters is the largest and most dangerous map.\n\n## Overview\n\n- **Size**: 200km²\n- **Difficulty**: Nightmare\n- **Players**: Up to 20\n- **Best Loot**: Yes\n\n## Key Locations\n\n### Alpha Complex\nMain building with keycard access. High-tier loot.\n\n### Beta Labs\nUnderground research facility. Active Matter clusters.\n\n### Airfield\nOpen area with vehicle spawns and extraction point.\n\n## Tips\n\n- Bring your best gear\n- Team up with friends\n- Plan your route carefully\n- Multiple extraction points available`,
      category: 'Maps',
      tags: ['headquarters', 'maps', 'advanced'],
      authorId: author.id,
      published: true,
      featured: false,
      rating: 4.9,
      views: 8340,
      likes: 654,
    },
  ];

  for (const guide of guides) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: {},
      create: guide,
    });
  }

  console.log(`Seeded ${guides.length} guides`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
