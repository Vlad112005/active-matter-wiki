import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Создаём роли
  const founderRole = await prisma.role.upsert({
    where: { name: 'founder' },
    update: {},
    create: {
      name: 'founder',
      displayName: 'Основатель',
      description: 'Полный доступ ко всем функциям',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Администратор',
      description: 'Управление контентом и пользователями',
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      displayName: 'Модератор',
      description: 'Модерация гайдов и комментариев',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      displayName: 'Пользователь',
      description: 'Обычный пользователь',
    },
  });

  console.log('✅ Roles created');

  // 2. Создаём уровни монолита (ИЗ ИГРЫ)
  const monolithLevels = [
    {
      code: 'ALPHA',
      order: 1,
      name: 'Уровень допуска: АЛЬФА',
      nameEn: 'Access Level: ALPHA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'BETA',
      order: 2,
      name: 'Уровень допуска: БЕТА',
      nameEn: 'Access Level: BETA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'GAMMA',
      order: 3,
      name: 'Уровень допуска: ГАММА',
      nameEn: 'Access Level: GAMMA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'DELTA',
      order: 4,
      name: 'Уровень допуска: ДЕЛЬТА',
      nameEn: 'Access Level: DELTA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'EPSILON',
      order: 5,
      name: 'Уровень допуска: ЭПСИЛОН',
      nameEn: 'Access Level: EPSILON',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'DZETA',
      order: 6,
      name: 'Уровень допуска: ДЗЕТА',
      nameEn: 'Access Level: DZETA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'ETA',
      order: 7,
      name: 'Уровень допуска: ЭТА',
      nameEn: 'Access Level: ETA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'THETA',
      order: 8,
      name: 'Уровень допуска: ТЕТА',
      nameEn: 'Access Level: THETA',
      requiredTokens: 10800,
      requiredCredits: 600,
    },
    {
      code: 'IOTA',
      order: 9,
      name: 'Уровень допуска: ЙОТА',
      nameEn: 'Access Level: IOTA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'KAPPA',
      order: 10,
      name: 'Уровень допуска: КАППА',
      nameEn: 'Access Level: KAPPA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'LAMBDA',
      order: 11,
      name: 'Уровень допуска: ЛЯМБДА',
      nameEn: 'Access Level: LAMBDA',
      requiredTokens: null,
      requiredCredits: null,
    },
    {
      code: 'MU',
      order: 12,
      name: 'Уровень допуска: МЮ',
      nameEn: 'Access Level: MU',
      requiredTokens: null,
      requiredCredits: null,
    },
  ];

  for (const level of monolithLevels) {
    await prisma.monolithLevel.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }

  console.log('✅ Monolith levels created');

  // 3. Получаем созданные уровни для связей
  const alphaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'ALPHA' } });
  const betaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'BETA' } });
  const gammaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'GAMMA' } });

  // 4. Пример предметов (ты добавишь остальные через админку)
  if (alphaLevel) {
    // Создаём примеры предметов для АЛЬФА
    const ak103 = await prisma.item.upsert({
      where: { name: 'AK-103' },
      update: {},
      create: {
        name: 'AK-103',
        nameEn: 'AK-103',
        description: 'Штурмовая винтовка. 7.62х39мм. Надёжная и мощная.',
        descriptionEn: 'Assault rifle. 7.62x39mm. Reliable and powerful.',
        type: 'weapon',
        rarity: 'rare',
        price: 175,
        monolithLevel: 'ALPHA',
        weight: 3.6,
        damage: 45,
        source: ['Магазин монолита', 'Лут в локациях'],
        sourceEn: ['Monolith shop', 'Location loot'],
        tags: ['rifle', 'automatic'],
      },
    });

    // Создаём разблокировки для АЛЬФА
    await prisma.monolithUnlock.create({
      data: {
        monolithLevelId: alphaLevel.id,
        type: 'item',
        itemId: ak103.id,
      },
    });

    await prisma.monolithUnlock.create({
      data: {
        monolithLevelId: alphaLevel.id,
        type: 'upgrade',
        upgradeName: 'Расширение склада +2500 объёма',
        upgradeNameEn: 'Storage expansion +2500 volume',
        upgradeCost: 1000,
      },
    });

    await prisma.monolithUnlock.create({
      data: {
        monolithLevelId: alphaLevel.id,
        type: 'recipe',
        recipeName: 'Хроногены (из Пожирателя)',
        recipeNameEn: 'Chronogens (from Devourer)',
      },
    });
  }

  if (betaLevel) {
    await prisma.monolithUnlock.create({
      data: {
        monolithLevelId: betaLevel.id,
        type: 'chrono',
        chronoName: 'Мелкая моторика III',
        chronoNameEn: 'Fine Motor Skills III',
        isLocked: false,
      },
    });
  }

  console.log('✅ Sample items and unlocks created');

  // 5. Настройки сайта
  await prisma.siteSettings.upsert({
    where: { key: 'site_version' },
    update: { value: '1.0.0' },
    create: {
      key: 'site_version',
      value: '1.0.0',
      description: 'Версия сайта',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'game_version' },
    update: { value: '0.8.5' },
    create: {
      key: 'game_version',
      value: '0.8.5',
      description: 'Версия игры',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'game_status' },
    update: { value: 'beta' },
    create: {
      key: 'game_status',
      value: 'beta',
      description: 'Статус игры (alpha/beta/early-access/release)',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'maintenance_mode' },
    update: { value: 'false' },
    create: {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Режим технических работ',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'maintenance_message' },
    update: { value: 'Сайт находится на техническом обслуживании. Скоро вернёмся!' },
    create: {
      key: 'maintenance_message',
      value: 'Сайт находится на техническом обслуживании. Скоро вернёмся!',
      description: 'Сообщение при тех. работах',
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'announcement' },
    update: { value: '' },
    create: {
      key: 'announcement',
      value: '',
      description: 'Объявление на сайте',
    },
  });

  console.log('✅ Site settings created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
