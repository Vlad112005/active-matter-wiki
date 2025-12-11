import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patches = [
    {
      version: '0.9.2',
      title: 'Balance Update & Bug Fixes',
      releaseDate: new Date('2025-11-15'),
      content: 'Major weapon balancing and performance improvements.',
    },
    {
      version: '0.9.1',
      title: 'New Map: Headquarters',
      releaseDate: new Date('2025-10-20'),
      content: 'Introducing the largest map in Active Matter with new boss encounters.',
    },
    {
      version: '0.9.0',
      title: 'Early Access Launch',
      releaseDate: new Date('2025-09-11'),
      content: 'Official Early Access release with 5 maps and full progression system.',
    },
  ];

  for (const patch of patches) {
    await prisma.patch.upsert({
      where: { version: patch.version },
      update: {},
      create: patch,
    });
  }

  console.log(`Seeded ${patches.length} patches`);
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
