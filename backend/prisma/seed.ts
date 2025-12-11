import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Роли
  await prisma.role.upsert({ where: { name: 'founder' }, update: {}, create: { name: 'founder', displayName: 'Основатель', description: 'Полный доступ ко всем функциям' } });
  await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin', displayName: 'Администратор', description: 'Управление контентом и пользователями' } });
  await prisma.role.upsert({ where: { name: 'moderator' }, update: {}, create: { name: 'moderator', displayName: 'Модератор', description: 'Модерация гайдов и комментариев' } });
  await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user', displayName: 'Пользователь', description: 'Обычный пользователь' } });
  console.log('✅ Roles created');

  // 2. Уровни монолита (СОГЛАСНО СКРИНШОТУ)
  const monolithLevels = [
    { code: 'ALPHA', order: 1, name: 'Уровень допуска: АЛЬФА', nameEn: 'Access Level: ALPHA', requiredTokens: 100, requiredCrystals: 0 },
    { code: 'BETA', order: 2, name: 'Уровень допуска: БЕТА', nameEn: 'Access Level: BETA', requiredTokens: 500, requiredCrystals: 200 },
    { code: 'GAMMA', order: 3, name: 'Уровень допуска: ГАММА', nameEn: 'Access Level: GAMMA', requiredTokens: 750, requiredCrystals: 225 },
    { code: 'DELTA', order: 4, name: 'Уровень допуска: ДЕЛЬТА', nameEn: 'Access Level: DELTA', requiredTokens: 1300, requiredCrystals: 260 },
    { code: 'EPSILON', order: 5, name: 'Уровень допуска: ЭПСИЛОН', nameEn: 'Access Level: EPSILON', requiredTokens: 2400, requiredCrystals: 310 },
    { code: 'DZETA', order: 6, name: 'Уровень допуска: ДЗЕТА', nameEn: 'Access Level: DZETA', requiredTokens: 4250, requiredCrystals: 375 },
    { code: 'ETA', order: 7, name: 'Уровень допуска: ЭТА', nameEn: 'Access Level: ETA', requiredTokens: 7000, requiredCrystals: 475 },
    { code: 'THETA', order: 8, name: 'Уровень допуска: ТЕТА', nameEn: 'Access Level: THETA', requiredTokens: 10800, requiredCrystals: 600 },
    { code: 'IOTA', order: 9, name: 'Уровень допуска: ЙОТА', nameEn: 'Access Level: IOTA', requiredTokens: 15900, requiredCrystals: 775 },
    { code: 'KAPPA', order: 10, name: 'Уровень допуска: КАППА', nameEn: 'Access Level: KAPPA', requiredTokens: 22350, requiredCrystals: 1050 },
    { code: 'LAMBDA', order: 11, name: 'Уровень допуска: ЛЯМБДА', nameEn: 'Access Level: LAMBDA', requiredTokens: 30500, requiredCrystals: 1500 },
    { code: 'MU', order: 12, name: 'Уровень допуска: МЮ', nameEn: 'Access Level: MU', requiredTokens: 40000, requiredCrystals: 2200 },
  ];

  for (const level of monolithLevels) {
    await prisma.monolithLevel.upsert({ where: { code: level.code }, update: level, create: level });
  }
  console.log('✅ Monolith levels created');

  const alphaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'ALPHA' } });
  const betaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'BETA' } });
  const gammaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'GAMMA' } });
  const deltaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'DELTA' } });
  const epsilonLevel = await prisma.monolithLevel.findUnique({ where: { code: 'EPSILON' } });

  // 3. ПРЕДМЕТЫ
  const items = [
    // ОРУЖИЕ
    { name: 'Glock 19', description: 'Компактный пистолет 9мм', type: 'weapon', rarity: 'common', price: 8500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.85, damage: 25, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'MP-443 Grach', description: 'Российский армейский пистолет 9×19мм', type: 'weapon', rarity: 'uncommon', price: 9500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.95, damage: 28, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'AK-103', description: 'Штурмовая винтовка 7.62×39мм', type: 'weapon', rarity: 'rare', price: 17500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.6, damage: 45, source: ['Магазин монолита'], tags: ['rifle', 'automatic'] },
    // ПРЕМИУМ (КРИСТАЛЛЫ)
    { name: 'Golden AK-103', description: 'Позолоченная штурмовая винтовка', type: 'weapon', rarity: 'legendary', price: 0, crystalPrice: 3023, monolithLevel: 'ALPHA', weight: 3.6, damage: 50, source: ['Магазин монолита (Кристаллы)'], tags: ['rifle', 'premium'] },
  ];

  for (const itemData of items) {
    await prisma.item.upsert({ where: { name: itemData.name }, update: itemData, create: itemData });
  }
  console.log('✅ Items created:', items.length);

  console.log('🎉 Seed completed!');
  console.log('✅ КРЕДИТЫ - для покупки предметов (price)');
  console.log('✅ КРИСТАЛЛЫ АМ - для редких предметов (crystalPrice) и открытия монолита (requiredCrystals)');
  console.log('✅ ЖЕТОНЫ МОНОЛИТА - для открытия уровней (requiredTokens)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
