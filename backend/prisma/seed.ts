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

  // 2. Уровни монолита (ТОЛЬКО ALPHA ОТКРЫТ)
  const monolithLevels = [
    { code: 'ALPHA', order: 1, name: 'Уровень допуска: АЛЬФА', nameEn: 'Access Level: ALPHA', requiredTokens: 0, requiredCredits: 0 },
    { code: 'BETA', order: 2, name: 'Уровень допуска: БЕТА', nameEn: 'Access Level: BETA', requiredTokens: 2400, requiredCredits: null },
    { code: 'GAMMA', order: 3, name: 'Уровень допуска: ГАММА', nameEn: 'Access Level: GAMMA', requiredTokens: 4800, requiredCredits: null },
    { code: 'DELTA', order: 4, name: 'Уровень допуска: ДЕЛЬТА', nameEn: 'Access Level: DELTA', requiredTokens: 7200, requiredCredits: null },
    { code: 'EPSILON', order: 5, name: 'Уровень допуска: ЭПСИЛОН', nameEn: 'Access Level: EPSILON', requiredTokens: 9600, requiredCredits: null },
    { code: 'DZETA', order: 6, name: 'Уровень допуска: ДЗЕТА', nameEn: 'Access Level: DZETA', requiredTokens: 12000, requiredCredits: null },
    { code: 'ETA', order: 7, name: 'Уровень допуска: ЭТА', nameEn: 'Access Level: ETA', requiredTokens: 14400, requiredCredits: null },
    { code: 'THETA', order: 8, name: 'Уровень допуска: ТЕТА', nameEn: 'Access Level: THETA', requiredTokens: 10800, requiredCredits: 600 },
    { code: 'IOTA', order: 9, name: 'Уровень допуска: ЙОТА', nameEn: 'Access Level: IOTA', requiredTokens: 16800, requiredCredits: null },
    { code: 'KAPPA', order: 10, name: 'Уровень допуска: КАППА', nameEn: 'Access Level: KAPPA', requiredTokens: 19200, requiredCredits: null },
    { code: 'LAMBDA', order: 11, name: 'Уровень допуска: ЛЯМБДА', nameEn: 'Access Level: LAMBDA', requiredTokens: 21600, requiredCredits: null },
    { code: 'MU', order: 12, name: 'Уровень допуска: МЮ', nameEn: 'Access Level: MU', requiredTokens: 24000, requiredCredits: null },
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

  // 3. ВСЕ ПРЕДМЕТЫ ИЗ СКРИНОВ С ЦЕНАМИ В КРЕДИТАХ
  const items = [
    // === ОРУЖИЕ (ALPHA-EPSILON) ===
    { name: 'Glock 19', description: 'Компактный пистолет 9мм', type: 'weapon', rarity: 'common', price: 8500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.85, damage: 25, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'MP-443 Grach', description: 'Российский армейский пистолет 9×19мм', type: 'weapon', rarity: 'uncommon', price: 9500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.95, damage: 28, source: ['Магазин монолита'], tags: ['pistol'] },
    { name: 'TOZ-34', description: 'Двуствольное охотничье ружьё 12 калибра', type: 'weapon', rarity: 'common', price: 12000, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.2, damage: 55, source: ['Магазин монолита'], tags: ['shotgun'] },
    { name: 'AK-103', description: 'Штурмовая винтовка 7.62×39мм', type: 'weapon', rarity: 'rare', price: 17500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.6, damage: 45, source: ['Магазин монолита'], tags: ['rifle', 'automatic'] },
    { name: 'Saiga-12', description: 'Автоматическое ружьё 12 калибра', type: 'weapon', rarity: 'rare', price: 18500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.7, damage: 60, source: ['Магазин монолита'], tags: ['shotgun', 'automatic'] },
    { name: 'MP5', description: 'Немецкий пистолет-пулемёт 9×19мм', type: 'weapon', rarity: 'uncommon', price: 15500, crystalPrice: 0, monolithLevel: 'BETA', weight: 2.5, damage: 30, source: ['Магазин монолита'], tags: ['smg', 'automatic'] },
    { name: 'M4A1', description: 'Американская штурмовая винтовка 5.56×45мм', type: 'weapon', rarity: 'rare', price: 19500, crystalPrice: 0, monolithLevel: 'BETA', weight: 3.4, damage: 42, source: ['Магазин монолита'], tags: ['rifle', 'automatic'] },
    { name: 'SPAS-12', description: 'Боевое помповое ружьё 12 калибра', type: 'weapon', rarity: 'rare', price: 16500, crystalPrice: 0, monolithLevel: 'BETA', weight: 4.4, damage: 65, source: ['Магазин монолита'], tags: ['shotgun'] },
    { name: 'SVD Dragunov', description: 'Снайперская винтовка 7.62×54мм', type: 'weapon', rarity: 'epic', price: 28500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 4.3, damage: 85, source: ['Магазин монолита'], tags: ['sniper', 'rifle'] },
    { name: 'PKM', description: 'Ручной пулемёт 7.62×54мм', type: 'weapon', rarity: 'epic', price: 32500, crystalPrice: 0, monolithLevel: 'DELTA', weight: 7.5, damage: 55, source: ['Магазин монолита'], tags: ['machine-gun'] },
    { name: 'AS Val', description: 'Штурмовая винтовка с глушителем 9×39мм', type: 'weapon', rarity: 'epic', price: 35000, crystalPrice: 0, monolithLevel: 'EPSILON', weight: 2.5, damage: 50, source: ['Магазин монолита'], tags: ['rifle', 'suppressed'] },

    // === БРОНЯ (ALPHA-DELTA) ===
    { name: 'PACA Soft Armor', description: 'Мягкая бронепластина', type: 'armor', rarity: 'common', price: 9500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.8, armor: 25, source: ['Магазин монолита'], tags: ['vest', 'soft'] },
    { name: 'Tactical Vest', description: 'Лёгкий тактический жилет', type: 'armor', rarity: 'common', price: 11000, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 2.5, armor: 30, source: ['Магазин монолита'], tags: ['vest', 'light'] },
    { name: 'Military Helmet', description: 'Военный шлем класс 2', type: 'armor', rarity: 'uncommon', price: 13500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.4, armor: 35, source: ['Магазин монолита'], tags: ['helmet'] },
    { name: 'A3 Helmet', description: 'Защитный шлем класс 3', type: 'armor', rarity: 'uncommon', price: 14500, crystalPrice: 0, monolithLevel: 'BETA', weight: 1.2, armor: 40, source: ['Магазин монолита'], tags: ['helmet'] },
    { name: 'Defender-2', description: 'Российский бронежилет класс 2', type: 'armor', rarity: 'uncommon', price: 16500, crystalPrice: 0, monolithLevel: 'BETA', weight: 3.5, armor: 45, source: ['Магазин монолита'], tags: ['vest', 'medium'] },
    { name: 'Fort Defender', description: 'Усиленный бронежилет класс 3', type: 'armor', rarity: 'rare', price: 22500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 5.2, armor: 60, source: ['Магазин монолита'], tags: ['vest', 'heavy'] },
    { name: 'Altyn Helmet', description: 'Тяжёлый штурмовой шлем класс 5', type: 'armor', rarity: 'epic', price: 28000, crystalPrice: 0, monolithLevel: 'DELTA', weight: 3.5, armor: 70, source: ['Магазин монолита'], tags: ['helmet', 'heavy'] },

    // === РАСХОДНИКИ (ALPHA-GAMMA) ===
    { name: 'Bandage', description: 'Бинт. Останавливает кровотечение', type: 'consumable', rarity: 'common', price: 1500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.1, stackable: true, maxStack: 20, source: ['Магазин монолита'], tags: ['medical'] },
    { name: 'Medkit', description: 'Аптечка. Восстанавливает 75 HP', type: 'consumable', rarity: 'common', price: 4500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.3, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['medical', 'healing'] },
    { name: 'Water Bottle', description: 'Бутылка воды', type: 'consumable', rarity: 'common', price: 1000, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.5, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['drink'] },
    { name: 'Canned Food', description: 'Консервы', type: 'consumable', rarity: 'common', price: 2000, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.4, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['food'] },
    { name: 'Energy Drink', description: 'Энергетический напиток', type: 'consumable', rarity: 'common', price: 2500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.5, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['drink', 'stamina'] },
    { name: 'Painkillers', description: 'Обезболивающее. Снимает боль на 60 сек', type: 'consumable', rarity: 'common', price: 3500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.1, stackable: true, maxStack: 10, source: ['Магазин монолита'], tags: ['medical'] },
    { name: 'Combat Stimulant', description: 'Боевой стимулятор +20% урон', type: 'consumable', rarity: 'rare', price: 12500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.2, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['stimulant'] },

    // === БОЕПРИПАСЫ (ALPHA-GAMMA) ===
    { name: '9mm Rounds', description: 'Патроны 9×19мм', type: 'resource', rarity: 'common', price: 100, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.01, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '9mm'] },
    { name: '12 Gauge Buckshot', description: 'Дробь 12 калибра', type: 'resource', rarity: 'common', price: 300, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.05, stackable: true, maxStack: 200, source: ['Магазин монолита'], tags: ['ammo', 'shotgun'] },
    { name: '5.56mm Rounds', description: 'Патроны 5.56×45мм НАТО', type: 'resource', rarity: 'uncommon', price: 200, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.012, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '5.56'] },
    { name: '7.62mm Rounds', description: 'Патроны 7.62×39мм', type: 'resource', rarity: 'uncommon', price: 200, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.016, stackable: true, maxStack: 500, source: ['Магазин монолита'], tags: ['ammo', '7.62'] },
    { name: '7.62×54mm Rounds', description: 'Снайперские патроны', type: 'resource', rarity: 'rare', price: 500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.022, stackable: true, maxStack: 300, source: ['Магазин монолита'], tags: ['ammo', 'sniper'] },

    // === РЕСУРСЫ (ALPHA-EPSILON) ===
    { name: 'Scrap Metal', description: 'Металлолом', type: 'resource', rarity: 'common', price: 500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.0, stackable: true, maxStack: 100, source: ['Лут'], tags: ['metal', 'crafting'] },
    { name: 'Electronics', description: 'Электронные компоненты', type: 'resource', rarity: 'uncommon', price: 1500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.3, stackable: true, maxStack: 50, source: ['Лут'], tags: ['electronics', 'crafting'] },
    { name: 'Polymer', description: 'Полимерный материал', type: 'resource', rarity: 'uncommon', price: 1200, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.5, stackable: true, maxStack: 100, source: ['Лут'], tags: ['polymer', 'crafting'] },
    { name: 'Chemicals', description: 'Химические реагенты', type: 'resource', rarity: 'rare', price: 2500, crystalPrice: 0, monolithLevel: 'DELTA', weight: 0.8, stackable: true, maxStack: 50, source: ['Лаборатории'], tags: ['chemicals', 'crafting'] },
    { name: 'Rare Components', description: 'Редкие компоненты', type: 'resource', rarity: 'epic', price: 5000, crystalPrice: 0, monolithLevel: 'EPSILON', weight: 0.5, stackable: true, maxStack: 20, source: ['Боссы'], tags: ['rare', 'crafting'] },

    // === ИНСТРУМЕНТЫ (ALPHA-DELTA) ===
    { name: 'Flashlight', description: 'Фонарик', type: 'resource', rarity: 'common', price: 3500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.3, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool', 'light'] },
    { name: 'Lockpick Set', description: 'Набор отмычек', type: 'resource', rarity: 'uncommon', price: 6500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.2, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool', 'lockpick'] },
    { name: 'Repair Kit', description: 'Ремонтный набор', type: 'resource', rarity: 'uncommon', price: 7500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 1.0, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['tool', 'repair'] },
    { name: 'Multitool', description: 'Мультитул', type: 'resource', rarity: 'rare', price: 9500, crystalPrice: 0, monolithLevel: 'DELTA', weight: 0.4, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['tool'] },

    // === ГРАНАТЫ (BETA-GAMMA) ===
    { name: 'Smoke Grenade', description: 'Дымовая граната', type: 'consumable', rarity: 'common', price: 4500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.25, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'smoke'] },
    { name: 'Flashbang', description: 'Светошумовая граната', type: 'consumable', rarity: 'uncommon', price: 6500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.18, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'tactical'] },
    { name: 'RGD-5 Grenade', description: 'Осколочная граната', type: 'consumable', rarity: 'uncommon', price: 8500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.31, stackable: true, maxStack: 5, source: ['Магазин монолита'], tags: ['grenade', 'explosive'] },

    // === МОДИФИКАЦИИ (BETA-EPSILON) ===
    { name: 'Red Dot Sight', description: 'Коллиматорный прицел', type: 'resource', rarity: 'uncommon', price: 8500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.15, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['attachment', 'sight'] },
    { name: 'Tactical Suppressor', description: 'Глушитель', type: 'resource', rarity: 'rare', price: 15000, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.3, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['attachment', 'suppressor'] },
    { name: '4x Scope', description: 'Оптический прицел 4x', type: 'resource', rarity: 'rare', price: 18000, crystalPrice: 0, monolithLevel: 'DELTA', weight: 0.4, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['attachment', 'scope'] },
    { name: 'Extended Magazine', description: 'Увеличенный магазин', type: 'resource', rarity: 'uncommon', price: 6500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.2, stackable: false, maxStack: 1, source: ['Магазин монолита'], tags: ['attachment', 'magazine'] },

    // === ПРЕМИУМ ПРЕДМЕТЫ (КРИСТАЛЛЫ) ===
    { name: 'Golden AK-103', description: 'Позолоченная штурмовая винтовка', type: 'weapon', rarity: 'legendary', price: 0, crystalPrice: 3023, monolithLevel: 'ALPHA', weight: 3.6, damage: 50, source: ['Магазин монолита (Кристаллы)'], tags: ['rifle', 'premium'] },
    { name: 'Exosuit Mk.1', description: 'Экзоскелет первого поколения', type: 'armor', rarity: 'legendary', price: 0, crystalPrice: 4445, monolithLevel: 'ALPHA', weight: 8.0, armor: 100, source: ['Магазин монолита (Кристаллы)'], tags: ['exosuit', 'premium'] },
  ];

  for (const itemData of items) {
    await prisma.item.upsert({ where: { name: itemData.name }, update: itemData, create: itemData });
  }
  console.log('✅ Items created:', items.length);

  // 4. Создаём разблокировки монолита
  if (alphaLevel) {
    const alphaItems = items.filter(i => i.monolithLevel === 'ALPHA');
    for (const item of alphaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `alpha-item-${dbItem.id}` },
          update: {},
          create: { id: `alpha-item-${dbItem.id}`, monolithLevelId: alphaLevel.id, type: 'item', itemId: dbItem.id, isLocked: false },
        });
      }
    }
  }

  if (betaLevel) {
    const betaItems = items.filter(i => i.monolithLevel === 'BETA');
    for (const item of betaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `beta-item-${dbItem.id}` },
          update: {},
          create: { id: `beta-item-${dbItem.id}`, monolithLevelId: betaLevel.id, type: 'item', itemId: dbItem.id, isLocked: false },
        });
      }
    }
  }

  if (gammaLevel) {
    const gammaItems = items.filter(i => i.monolithLevel === 'GAMMA');
    for (const item of gammaItems) {
      const dbItem = await prisma.item.findUnique({ where: { name: item.name } });
      if (dbItem) {
        await prisma.monolithUnlock.upsert({
          where: { id: `gamma-item-${dbItem.id}` },
          update: {},
          create: { id: `gamma-item-${dbItem.id}`, monolithLevelId: gammaLevel.id, type: 'item', itemId: dbItem.id, isLocked: false },
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
          create: { id: `delta-item-${dbItem.id}`, monolithLevelId: deltaLevel.id, type: 'item', itemId: dbItem.id, isLocked: false },
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
          create: { id: `epsilon-item-${dbItem.id}`, monolithLevelId: epsilonLevel.id, type: 'item', itemId: dbItem.id, isLocked: false },
        });
      }
    }
  }

  console.log('✅ Monolith unlocks created');

  // 5. Настройки сайта
  await prisma.siteSettings.upsert({ where: { key: 'site_version' }, update: { value: '1.0.0' }, create: { key: 'site_version', value: '1.0.0', description: 'Версия сайта' } });
  await prisma.siteSettings.upsert({ where: { key: 'game_version' }, update: { value: '0.8.5' }, create: { key: 'game_version', value: '0.8.5', description: 'Версия игры' } });
  await prisma.siteSettings.upsert({ where: { key: 'game_status' }, update: { value: 'beta' }, create: { key: 'game_status', value: 'beta', description: 'Статус игры' } });
  await prisma.siteSettings.upsert({ where: { key: 'maintenance_mode' }, update: { value: 'false' }, create: { key: 'maintenance_mode', value: 'false', description: 'Режим технических работ' } });
  await prisma.siteSettings.upsert({ where: { key: 'maintenance_message' }, update: { value: 'Сайт находится на техническом обслуживании' }, create: { key: 'maintenance_message', value: 'Сайт находится на техническом обслуживании', description: 'Сообщение при тех. работах' } });
  await prisma.siteSettings.upsert({ where: { key: 'announcement' }, update: { value: '' }, create: { key: 'announcement', value: '', description: 'Объявление на сайте' } });

  console.log('✅ Site settings created');
  console.log('🎉 Seed completed!');
  console.log('📊 Created:', items.length, 'items with correct prices');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
