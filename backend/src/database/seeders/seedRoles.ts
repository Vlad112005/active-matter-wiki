import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const roles = [
    { name: 'user', description: 'Обычный пользователь' },
    { name: 'premium', description: 'Премиум пользователь с эксклюзивным доступом' },
    { name: 'moderator', description: 'Модератор контента и новостей' },
    { name: 'admin', description: 'Администратор, управляющий модераторами и контентом' },
    { name: 'founder', description: 'Основатель с полными правами' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Base roles seeded');
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
