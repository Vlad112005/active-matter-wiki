import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const locations = [
    {
      name: 'Factory',
      description: 'Small industrial complex with tight corridors. Fast-paced combat.',
      difficulty: 'easy',
      tips: ['Close quarters combat', 'High player traffic', 'Quick raids'],
    },
    {
      name: 'Scrapyard',
      description: 'Abandoned vehicle graveyard. Open areas with cover.',
      difficulty: 'easy',
      tips: ['Good for beginners', 'Medium loot density', 'Watch for snipers'],
    },
    {
      name: 'Cargo Port',
      description: 'Large port with shipping containers. Multiple vertical levels.',
      difficulty: 'medium',
      tips: ['Complex layout', 'Good loot', 'Multiple extraction points'],
    },
    {
      name: 'Military Base',
      description: 'Former military installation. High-tier loot and strong enemies.',
      difficulty: 'hard',
      tips: ['Bring good gear', 'Armored enemies', 'Keycard access areas'],
    },
    {
      name: 'Headquarters',
      description: 'Massive underground facility. Largest map with best loot.',
      difficulty: 'nightmare',
      tips: ['200km² map', 'All enemy types', 'Long extraction times', 'Highest rewards'],
    },
  ];

  for (const location of locations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: location,
    });
  }

  console.log(`Seeded ${locations.length} locations`);
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
