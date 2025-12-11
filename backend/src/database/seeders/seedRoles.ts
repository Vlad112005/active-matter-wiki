import { prisma } from '../client.js';

const roles = [
  { name: 'user', displayName: 'Пользователь', description: 'Обычный пользователь с базовым доступом' },
  { name: 'premium', displayName: 'Premium', description: 'Пользователь с премиум подпиской' },
  { name: 'moderator', displayName: 'Модератор', description: 'Модератор контента' },
  { name: 'admin', displayName: 'Администратор', description: 'Администратор системы' },
  { name: 'founder', displayName: 'Основатель', description: 'Основатель проекта с полным доступом' },
];

const main = async () => {
  console.log('Seeding roles...');

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { displayName: role.displayName, description: role.description },
      create: role,
    });
  }

  console.log('✅ Roles seeded successfully');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
