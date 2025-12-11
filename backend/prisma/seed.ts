import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Создаём роли
  await prisma.role.upsert({
    where: { name: 'founder' },
    update: {},
    create: {
      name: 'founder',
      displayName: 'Основатель',
      description: 'Полный доступ ко всем функциям',
    },
  });

  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Администратор',
      description: 'Управление контентом и пользователями',
    },
  });

  await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      displayName: 'Модератор',
      description: 'Модерация гайдов и комментариев',
    },
  });

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      displayName: 'Пользователь',
      description: 'Обычный пользователь',
    },
  });

  console.log('✅ Roles created');

  // 2. Создаём уровни монолита (ВСЕ РАЗБЛОКИРОВАНЫ)
  const monolithLevels = [
    { code: 'ALPHA', order: 1, name: 'Уровень допуска: АЛЬФА', nameEn: 'Access Level: ALPHA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'BETA', order: 2, name: 'Уровень допуска: БЕТА', nameEn: 'Access Level: BETA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'GAMMA', order: 3, name: 'Уровень допуска: ГАММА', nameEn: 'Access Level: GAMMA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'DELTA', order: 4, name: 'Уровень допуска: ДЕЛЬТА', nameEn: 'Access Level: DELTA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'EPSILON', order: 5, name: 'Уровень допуска: ЭПСИЛОН', nameEn: 'Access Level: EPSILON', requiredTokens: 0, requiredCredits: 0 },
    { code: 'DZETA', order: 6, name: 'Уровень допуска: ДЗЕТА', nameEn: 'Access Level: DZETA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'ETA', order: 7, name: 'Уровень допуска: ЭТА', nameEn: 'Access Level: ETA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'THETA', order: 8, name: 'Уровень допуска: ТЕТА', nameEn: 'Access Level: THETA', requiredTokens: 10800, requiredCredits: 600 },
    { code: 'IOTA', order: 9, name: 'Уровень допуска: ЙОТА', nameEn: 'Access Level: IOTA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'KAPPA', order: 10, name: 'Уровень допуска: КАППА', nameEn: 'Access Level: KAPPA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'LAMBDA', order: 11, name: 'Уровень допуска: ЛЯМБДА', nameEn: 'Access Level: LAMBDA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'MU', order: 12, name: 'Уровень допуска: МЮ', nameEn: 'Access Level: MU', requiredTokens: 0, requiredCredits: 0 },
  ];

  for (const level of monolithLevels) {
    await prisma.monolithLevel.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }

  console.log('✅ Monolith levels created (all unlocked)');

  // Получаем созданные уровни
  const alphaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'ALPHA' } });
  const betaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'BETA' } });
  const gammaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'GAMMA' } });
  const deltaLevel = await prisma.monolithLevel.findUnique({ where: { code: 'DELTA' } });
  const epsilonLevel = await prisma.monolithLevel.findUnique({ where: { code: 'EPSILON' } });

  // 3. ПРЕДМЕТЫ СО СКРИНОВ С ЦЕНАМИ И МОНОЛИТАМИ
  const items = [
    // === ОРУЖИЕ ===
    { name: 'AK-103', nameEn: 'AK-103', description: 'Штурмовая винтовка. 7.62×39мм. Надёжная и мощная.', type: 'weapon', rarity: 'rare', price: 175, monolithLevel: 'ALPHA', weight: 3.6, damage: 45, source: ['Магазин монолита'], tags: ['rifle', 'automatic'] },
    { name: 'Glock 19', nameEn: 'Glock 19', description: 'Компактный пистолет 9мм. Надёжный и лёгкий.', type: 'weapon', rarity: 'common', price: 85, monolithLevel: 'ALPHA', weight: 0.85, damage: 25, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'MP-443 Grach', nameEn: 'MP-443 Grach', description: 'Российский армейский пистолет 9×19мм.', type: 'weapon', rarity: 'uncommon', price: 95, monolithLevel: 'ALPHA', weight: 0.95, damage: 28, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'Saiga-12', nameEn: 'Saiga-12', description: 'Автоматическое ружьё 12 калибра.', type: 'weapon', rarity: 'rare', price: 185, monolithLevel: 'ALPHA', weight: 3.7, damage: 60, source: ['Магазин монолита'], tags: ['shotgun', 'automatic'] },
    { name: 'TOZ-34', nameEn: 'TOZ-34', description: 'Двуствольное охотничье ружьё 12 калибра.', type: 'weapon', rarity: 'common', price: 120, monolithLevel: 'ALPHA', weight: 3.2, damage: 55, source: ['Магазин монолита'], tags: ['shotgun'] },
    { name: 'M4A1', nameEn: 'M4A1', description: 'Американская штурмовая винтовка 5.56×45мм.', type: 'weapon', rarity: 'rare', price: 195, monolithLevel: 'BETA', weight: 3.4, damage: 42, source: ['Магазин монолита'], tags: ['rifle', 'automatic'] },
    { name: 'SVD Dragunov', nameEn: 'SVD Dragunov', description: 'Снайперская винтовка 7.62×54мм.', type: 'weapon', rarity: 'epic', price: 285, monolithLevel: 'GAMMA', weight: 4.3, damage: 85, source: ['Магазин монолита'], tags: ['sniper', 'rifle'] },
    { name: 'PKM', nameEn: 'PKM', description: 'Ручной пулемёт 7.62×54мм.', type: 'weapon', rarity: 'epic', price: 325, monolithLevel: 'DELTA', weight: 7.5, damage: 55, source: ['Магазин монолита'], tags: ['machine-gun'] },

    // === БРОНЯ ===
    { name: 'Tactical Vest', nameEn: 'Tactical Vest', description: 'Лёгкий тактический жилет. Базовая защита.', type: 'armor', rarity: 'common', price: 110, monolithLevel: 'ALPHA', weight: 2.5, armor: 30, source: ['Магазин монолита'], tags: ['vest', 'light'] },
    { name: 'Military Helmet', nameEn: 'Military Helmet', description: 'Военный шлем. Защита головы 2 класса.', type: 'armor', rarity: 'uncommon', price: 135, monolithLevel: 'ALPHA', weight: 1.4, armor: 35, source: ['Магазин монолита'], tags: ['helmet'] },
    { name: 'A3 Helmet', nameEn: 'A3 Helmet', description: 'Защитный шлем. Баллистическая защита 3 класса.', type: 'armor', rarity: 'uncommon', price: 145, monolithLevel: 'BETA', weight: 1.2, armor: 40, source: ['Магазин монолита'], tags: ['helmet', 'armor'] },
    { name: 'PACA Soft Armor', nameEn: 'PACA Soft Armor', description: 'Мягкая бронепластина. Лёгкая защита от осколков.', type: 'armor', rarity: 'common', price: 95, monolithLevel: 'ALPHA', weight: 1.8, armor: 25, source: ['Магазин монолита'], tags: ['vest', 'soft'] },
    { name: 'Defender-2', nameEn: 'Defender-2', description: 'Российский бронежилет 2 класса защиты.', type: 'armor', rarity: 'uncommon', price: 165, monolithLevel: 'BETA', weight: 3.5, armor: 45, source: ['Магазин монолита'], tags: ['vest', 'medium'] },
    { name: 'Fort Defender', nameEn: 'Fort Defender', description: 'Усиленный бронежилет 3 класса защиты.', type: 'armor', rarity: 'rare', price: 225, monolithLevel: 'GAMMA', weight: 5.2, armor: 60, source: ['Магазин монолита'], tags: ['vest', 'heavy'] },

    // === РАСХОДНИКИ ===
    { name: 'Medkit', nameEn: 'Medkit', description: 'Аптечка первой помощи. Восстанавливает 75 HP.', type: 'consumable', rarity: 'common', price: 45, monolithLevel: 'ALPHA', weight: 0.3, stackable: true, maxStack: 10, source: ['Магазин монолита', 'Лут'], tags: ['medical', 'healing'] },
    { name: 'Bandage', nameEn: 'Bandage', description: 'Бинт. Останавливает кровотечение и восстанавливает 15 HP.', type: 'consumable', rarity: 'common', price: 15, monolithLevel: 'ALPHA', weight: 0.1, stackable: true, maxStack: 20, source: ['Магазин монолита', 'Лут'], tags: ['medical'] },
    { name: 'Energy Drink', nameEn: 'Energy Drink', description: 'Энергетический напиток. Восстанавливает выносливость.', type: 'consumable', rarity: 'common', price: 25, monolithLevel: 'ALPHA', weight: 0.5, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['drink', 'stamina'] },
    { name: 'Water Bottle', nameEn: 'Water Bottle', description: 'Бутылка воды. Утоляет жажду.', type: 'consumable', rarity: 'common', price: 10, monolithLevel: 'ALPHA', weight: 0.5, stackable: true, maxStack: 10, source: ['Магазин монолита', 'Лут'], tags: ['drink'] },
    { name: 'Canned Food', nameEn: 'Canned Food', description: 'Консервы. Восстанавливает 30 голода.', type: 'consumable', rarity: 'common', price: 20, monolithLevel: 'ALPHA', weight: 0.4, stackable: true, maxStack: 10, source: ['Магазин монолита', 'Лут'], tags: ['food'] },
    { name: 'Painkillers', nameEn: 'Painkillers', description: 'Обезболивающее. Снимает боль на 60 сек.', type: 'consumable', rarity: 'common', price: 35, monolithLevel: 'BETA', weight: 0.1, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['medical', 'painkiller'] },
    { name: 'Combat Stimulant', nameEn: 'Combat Stimulant', description: 'Боевой стимулятор. Увеличивает урон на 20%.', type: 'consumable', rarity: 'rare', price: 125, monolithLevel: 'GAMMA', weight: 0.2, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['stimulant', 'buff'] },

    // === БОЕПРИПАСЫ ===
    { name: '9mm Rounds', nameEn: '9mm Rounds', description: 'Патроны 9×19мм. Для пистолетов.', type: 'resource', rarity: 'common', price: 1, monolithLevel: 'ALPHA', weight: 0.01, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '9mm'] },
    { name: '5.56mm Rounds', nameEn: '5.56mm Rounds', description: 'Патроны 5.56×45мм. НАТО стандарт.', type: 'resource', rarity: 'uncommon', price: 2, monolithLevel: 'BETA', weight: 0.012, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '5.56'] },
    { name: '7.62mm Rounds', nameEn: '7.62mm Rounds', description: 'Патроны 7.62×39мм. Для автоматов.', type: 'resource', rarity: 'uncommon', price: 2, monolithLevel: 'BETA', weight: 0.016, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '7.62'] },
    { name: '12 Gauge Buckshot', nameEn: '12 Gauge Buckshot', description: 'Дробь 12 калибра. Для дробовиков.', type: 'resource', rarity: 'common', price: 3, monolithLevel: 'ALPHA', weight: 0.05, stackable: true, maxStack: 200, source: ['Магазин монолита'], tags: ['ammo', 'shotgun'] },
    { name: '7.62×54mm Rounds', nameEn: '7.62×54mm Rounds', description: 'Снайперские патроны 7.62×54мм.', type: 'resource', rarity: 'rare', price: 5, monolithLevel: 'GAMMA', weight: 0.022, stackable: true, maxStack: 300, source: ['Магазин монолита'], tags: ['ammo', 'sniper'] },

    // === РЕСУРСЫ ===
    { name: 'Scrap Metal', nameEn: 'Scrap Metal', description: 'Металлолом. Базовый ресурс для крафта.', type: 'resource', rarity: 'common', price: 5, monolithLevel: 'ALPHA', weight: 1.0, stackable: true, maxStack: 100, source: ['Лут', 'Разборка предметов'], tags: ['metal', 'crafting'] },
    { name: 'Electronics', nameEn: 'Electronics', description: 'Электронные компоненты. Для продвинутого крафта.', type: 'resource', rarity: 'uncommon', price: 15, monolithLevel: 'BETA', weight: 0.3, stackable: true, maxStack: 50, source: ['Лут', 'Разборка техники'], tags: ['electronics', 'crafting'] },
    { name: 'Polymer', nameEn: 'Polymer', description: 'Полимерный материал. Для лёгких деталей.', type: 'resource', rarity: 'uncommon', price: 12, monolithLevel: 'GAMMA', weight: 0.5, stackable: true, maxStack: 100, source: ['Лут'], tags: ['polymer', 'crafting'] },
    { name: 'Chemicals', nameEn: 'Chemicals', description: 'Химические реагенты. Для медикаментов и взрывчатки.', type: 'resource', rarity: 'rare', price: 25, monolithLevel: 'DELTA', weight: 0.8, stackable: true, maxStack: 50, source: ['Лаборатории'], tags: ['chemicals', 'crafting'] },
    { name: 'Rare Components', nameEn: 'Rare Components', description: 'Редкие компоненты. Для уникальных предметов.', type: 'resource', rarity: 'epic', price: 50, monolithLevel: 'EPSILON', weight: 0.5, stackable: true, maxStack: 20, source: ['Боссы', 'Редкий лут'], tags: ['rare', 'crafting'] },

    // === ИНСТРУМЕНТЫ ===
    { name: 'Flashlight', nameEn: 'Flashlight', description: 'Фонарик. Освещает тёмные зоны.', type: 'resource', rarity: 'common', price: 35, monolithLevel: 'ALPHA', weight: 0.3, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool', 'light'] },
    { name: 'Lockpick Set', nameEn: 'Lockpick Set', description: 'Набор отмычек. Для взлома замков.', type: 'resource', rarity: 'uncommon', price: 65, monolithLevel: 'BETA', weight: 0.2, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool', 'lockpick'] },
    { name: 'Repair Kit', nameEn: 'Repair Kit', description: 'Ремонтный набор. Восстанавливает прочность предметов.', type: 'resource', rarity: 'uncommon', price: 75, monolithLevel: 'GAMMA', weight: 1.0, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['tool', 'repair'] },
    { name: 'Multitool', nameEn: 'Multitool', description: 'Мультитул. Универсальный инструмент.', type: 'resource', rarity: 'rare', price: 95, monolithLevel: 'DELTA', weight: 0.4, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool'] },

    // === ГРАНАТЫ ===
    { name: 'RGD-5 Grenade', nameEn: 'RGD-5 Grenade', description: 'Осколочная граната. Радиус поражения 5м.', type: 'consumable', rarity: 'uncommon', price: 85, monolithLevel: 'BETA', weight: 0.31, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'explosive'] },
    { name: 'Flashbang', nameEn: 'Flashbang', description: 'Светошумовая граната. Оглушает на 5 сек.', type: 'consumable', rarity: 'uncommon', price: 65, monolithLevel: 'GAMMA', weight: 0.18, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'tactical'] },
    { name: 'Smoke Grenade', nameEn: 'Smoke Grenade', description: 'Дымовая граната. Создаёт дымовую завесу.', type: 'consumable', rarity: 'common', price: 45, monolithLevel: 'BETA', weight: 0.25, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'smoke'] },
  ];

  for (const itemData of items) {
    await prisma.item.upsert({
      where: { name: itemData.name },
      update: itemData,
      create: itemData,
    });
  }

  console.log('✅ Items created:', items.length);

  // 4. Создаём разблокировки монолита (привязываем предметы)
  if (alphaLevel) {
    const alphaItems = items.filter(i => i.monolithLevel === 'ALPHA');
    for (const item of alphaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `alpha-item-${dbItem.id}` },
          update: {},
          create: {
            id: `alpha-item-${dbItem.id}`,
            monolithLevelId: alphaLevel.id,
            type: 'item',
            itemId: dbItem.id,
            isLocked: false,
          },
        });
      }
    }

    // Добавляем апгрейды
    await prisma.monolithUnlock.upsert({
      where: { id: 'alpha-upgrade-storage' },
      update: {},
      create: {
        id: 'alpha-upgrade-storage',
        monolithLevelId: alphaLevel.id,
        type: 'upgrade',
        upgradeName: 'Расширение склада +2500 объёма',
        upgradeNameEn: 'Storage expansion +2500 volume',
        upgradeCost: 1000,
        isLocked: false,
      },
    });

    await prisma.monolithUnlock.upsert({
      where: { id: 'alpha-recipe-chrono' },
      update: {},
      create: {
        id: 'alpha-recipe-chrono',
        monolithLevelId: alphaLevel.id,
        type: 'recipe',
        recipeName: 'Хроногены (из Пожирателя)',
        recipeNameEn: 'Chronogens (from Devourer)',
        isLocked: false,
      },
    });
  }

  if (betaLevel) {
    const betaItems = items.filter(i => i.monolithLevel === 'BETA');
    for (const item of betaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `beta-item-${dbItem.id}` },
          update: {},
          create: {
            id: `beta-item-${dbItem.id}`,
            monolithLevelId: betaLevel.id,
            type: 'item',
            itemId: dbItem.id,
            isLocked: false,
          },
        });
      }
    }

    await prisma.monolithUnlock.upsert({
      where: { id: 'beta-chrono-motor' },
      update: {},
      create: {
        id: 'beta-chrono-motor',
        monolithLevelId: betaLevel.id,
        type: 'chrono',
        chronoName: 'Мелкая моторика III',
        chronoNameEn: 'Fine Motor Skills III',
        isLocked: false,
      },
    });
  }

  if (gammaLevel) {
    const gammaItems = items.filter(i => i.monolithLevel === 'GAMMA');
    for (const item of gammaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `gamma-item-${dbItem.id}` },
          update: {},
          create: {
            id: `gamma-item-${dbItem.id}`,
            monolithLevelId: gammaLevel.id,
            type: 'item',
            itemId: dbItem.id,
            isLocked: false,
          },
        });
      }
    }
  }

  if (deltaLevel) {
    const deltaItems = items.filter(i => i.monolithLevel === 'DELTA');
    for (const item of deltaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `delta-item-${dbItem.id}` },
          update: {},
          create: {
            id: `delta-item-${dbItem.id}`,
            monolithLevelId: deltaLevel.id,
            type: 'item',
            itemId: dbItem.id,
            isLocked: false,
          },
        });
      }
    }
  }

  if (epsilonLevel) {
    const epsilonItems = items.filter(i => i.monolithLevel === 'EPSILON');
    for (const item of epsilonItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `epsilon-item-${dbItem.id}` },
          update: {},
          create: {
            id: `epsilon-item-${dbItem.id}`,
            monolithLevelId: epsilonLevel.id,
            type: 'item',
            itemId: dbItem.id,
            isLocked: false,
          },
        });
      }
    }
  }

  console.log('✅ Monolith unlocks created');

  // 5. Настройки сайта
  await prisma.siteSettings.upsert({
    where: { key: 'site_version' },
    update: { value: '1.0.0' },
    create: { key: 'site_version', value: '1.0.0', description: 'Версия сайта' },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'game_version' },
    update: { value: '0.8.5' },
    create: { key: 'game_version', value: '0.8.5', description: 'Версия игры' },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'game_status' },
    update: { value: 'beta' },
    create: { key: 'game_status', value: 'beta', description: 'Статус игры' },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'maintenance_mode' },
    update: { value: 'false' },
    create: { key: 'maintenance_mode', value: 'false', description: 'Режим технических работ' },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'maintenance_message' },
    update: { value: 'Сайт находится на техническом обслуживании. Скоро вернёмся!' },
    create: { key: 'maintenance_message', value: 'Сайт находится на техническом обслуживании. Скоро вернёмся!', description: 'Сообщение при тех. работах' },
  });

  await prisma.siteSettings.upsert({
    where: { key: 'announcement' },
    update: { value: '' },
    create: { key: 'announcement', value: '', description: 'Объявление на сайте' },
  });

  console.log('✅ Site settings created');
  console.log('🎉 Seed completed successfully!');
  console.log('📊 Created:');
  console.log('  - 4 roles');
  console.log('  - 12 monolith levels (all unlocked)');
  console.log('  - ' + items.length + ' items with prices');
  console.log('  - Monolith unlocks linked to items');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
