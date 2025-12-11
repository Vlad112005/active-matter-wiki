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

  // 2. Уровни монолита
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

  // 3. ПРЕДМЕТЫ (48 всего)
  const items = [
    // === ОРУЖИЕ ===
    { name: 'Glock 19', description: 'Компактный пистолет 9мм', type: 'weapon', rarity: 'common', price: 8500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.85, damage: 25, source: ['Магазин'], tags: ['pistol'] },
    { name: 'MP-443 Grach', description: 'Российский армейский пистолет', type: 'weapon', rarity: 'uncommon', price: 9500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.95, damage: 28, source: ['Магазин'], tags: ['pistol'] },
    { name: 'M1911 A1', description: 'Классический американский пистолет', type: 'weapon', rarity: 'common', price: 8000, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.1, damage: 30, source: ['Магазин'], tags: ['pistol'] },
    { name: 'SIG P226', description: 'Швейцарский пистолет повышенной мощности', type: 'weapon', rarity: 'rare', price: 12000, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.75, damage: 32, source: ['Магазин'], tags: ['pistol', 'premium'] },
    
    { name: 'AK-103', description: 'Штурмовая винтовка 7.62×39мм', type: 'weapon', rarity: 'rare', price: 17500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.6, damage: 45, source: ['Магазин'], tags: ['rifle'] },
    { name: 'M16A4', description: 'Американская автоматическая винтовка', type: 'weapon', rarity: 'rare', price: 18500, crystalPrice: 0, monolithLevel: 'BETA', weight: 3.85, damage: 42, source: ['Магазин'], tags: ['rifle'] },
    { name: 'HK417', description: 'Полноразмерная боевая винтовка', type: 'weapon', rarity: 'epic', price: 0, crystalPrice: 850, monolithLevel: 'GAMMA', weight: 4.1, damage: 55, source: ['Кристаллы'], tags: ['rifle', 'premium'] },
    { name: 'SR-25', description: 'Полуавтоматическая снайперская винтовка', type: 'weapon', rarity: 'epic', price: 0, crystalPrice: 1200, monolithLevel: 'DELTA', weight: 5.0, damage: 65, source: ['Кристаллы'], tags: ['sniper'] },
    
    { name: 'Remington 870', description: 'Помповое дробовое ружьё', type: 'weapon', rarity: 'common', price: 6500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 3.8, damage: 50, source: ['Магазин'], tags: ['shotgun'] },
    { name: 'Benelli M4', description: 'Полуавтоматическое боевое ружьё', type: 'weapon', rarity: 'rare', price: 12000, crystalPrice: 0, monolithLevel: 'BETA', weight: 3.6, damage: 55, source: ['Магазин'], tags: ['shotgun'] },
    
    // === БОЕПРИПАСЫ ===
    { name: '9x19 Parabellum', description: 'Стандартный патрон 9mm', type: 'resource', rarity: 'common', price: 50, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.01, stackable: true, maxStack: 9999, source: ['Магазин'], tags: ['ammo', 'pistol'] },
    { name: '7.62x39 FMJ', description: 'Стандартный патрон 7.62mm', type: 'resource', rarity: 'common', price: 75, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.015, stackable: true, maxStack: 9999, source: ['Магазин'], tags: ['ammo', 'rifle'] },
    { name: '12 Gauge Buckshot', description: 'Дробь 12 калибра', type: 'resource', rarity: 'common', price: 300, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.05, stackable: true, maxStack: 200, source: ['Магазин'], tags: ['ammo', 'shotgun'] },
    { name: '.308 Winchester', description: 'Снайперский патрон', type: 'resource', rarity: 'uncommon', price: 150, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.02, stackable: true, maxStack: 500, source: ['Магазин'], tags: ['ammo', 'sniper'] },
    { name: '5.56x45 NATO', description: 'NATO стандартный патрон', type: 'resource', rarity: 'common', price: 60, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.012, stackable: true, maxStack: 9999, source: ['Магазин'], tags: ['ammo', 'rifle'] },
    
    // === БРОНЯ ===
    { name: 'UTAS Level II Body Armor', description: 'Керамическая защита уровня II', type: 'armor', rarity: 'uncommon', price: 15000, crystalPrice: 0, monolithLevel: 'BETA', weight: 2.5, armor: 35, source: ['Магазин'], tags: ['vest', 'protection'] },
    { name: 'Ops-Core FAST Helmet', description: 'Боевой шлем', type: 'armor', rarity: 'common', price: 3500, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.2, armor: 15, source: ['Магазин'], tags: ['helmet'] },
    { name: 'Crye Precision G3 Combat Pants', description: 'Тактические боевые штаны', type: 'armor', rarity: 'uncommon', price: 4000, crystalPrice: 0, monolithLevel: 'BETA', weight: 1.0, armor: 8, source: ['Магазин'], tags: ['pants'] },
    
    // === ИНСТРУМЕНТЫ ===
    { name: 'Multi-tool Leatherman', description: 'Универсальный многофункциональный нож', type: 'tool', rarity: 'common', price: 1200, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.2, stackable: false, source: ['Магазин'], tags: ['utility'] },
    { name: 'First Aid Kit', description: 'Полный набор первой помощи', type: 'tool', rarity: 'common', price: 800, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.5, stackable: false, source: ['Магазин'], tags: ['medical'] },
    { name: 'Night Vision Goggles AN/PVS-14', description: 'Прибор ночного видения', type: 'tool', rarity: 'rare', price: 8500, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.6, stackable: false, source: ['Магазин'], tags: ['optics'] },
    { name: 'Thermal Imaging Scope', description: 'Тепловизионный прицел', type: 'tool', rarity: 'epic', price: 0, crystalPrice: 2500, monolithLevel: 'DELTA', weight: 1.5, stackable: false, source: ['Кристаллы'], tags: ['optics', 'premium'] },
    
    // === РАСХОДНИКИ ===
    { name: 'Canned Beans', description: 'Консервированная фасоль - источник энергии', type: 'consumable', rarity: 'common', price: 150, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.3, stackable: true, maxStack: 50, source: ['Магазин'], tags: ['food'] },
    { name: 'Canned Meat Stew', description: 'Мясное рагу в консервах', type: 'consumable', rarity: 'uncommon', price: 250, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.4, stackable: true, maxStack: 50, source: ['Магазин'], tags: ['food'] },
    { name: 'Protein Bars', description: 'Высокобелковые батончики (упак. 10)', type: 'consumable', rarity: 'common', price: 200, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.15, stackable: true, maxStack: 100, source: ['Магазин'], tags: ['food'] },
    { name: 'Water Bottle 1L', description: 'Бутылка питьевой воды', type: 'consumable', rarity: 'common', price: 80, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 1.0, stackable: true, maxStack: 20, source: ['Магазин'], tags: ['drink'] },
    { name: 'Medical Stimulant', description: 'Стимулирующий препарат повышает фокус', type: 'consumable', rarity: 'rare', price: 500, crystalPrice: 0, monolithLevel: 'BETA', weight: 0.05, stackable: true, maxStack: 50, source: ['Магазин'], tags: ['medical'] },
    
    // === СПЕЦИАЛЬНЫЕ ===
    { name: 'Monolith Access Token', description: 'Жетон доступа монолита (материальная форма)', type: 'special', rarity: 'epic', price: 0, crystalPrice: 0, monolithLevel: 'ALPHA', weight: 0.01, isQuestItem: false, stackable: true, maxStack: 999, source: ['Монолит'], tags: ['token', 'quest'] },
    { name: 'AM Crystal Fragment', description: 'Фрагмент кристалла активной материи', type: 'special', rarity: 'legendary', price: 0, crystalPrice: 50, monolithLevel: 'BETA', weight: 0.05, isQuestItem: false, stackable: true, maxStack: 999, source: ['Лут'], tags: ['crystal'] },
    { name: 'Ancient Artifact', description: 'Древний артефакт неизвестного происхождения', type: 'special', rarity: 'legendary', price: 0, crystalPrice: 5000, monolithLevel: 'MU', weight: 2.0, isQuestItem: true, stackable: false, source: ['Скрытые локации'], tags: ['artifact', 'rare'] },
    
    // === ПРЕМИУМ (КРИСТАЛЛЫ) ===
    { name: 'Golden AK-103', description: 'Позолоченная штурмовая винтовка', type: 'weapon', rarity: 'legendary', price: 0, crystalPrice: 3023, monolithLevel: 'ALPHA', weight: 3.6, damage: 50, source: ['Магазин (Кристаллы)'], tags: ['rifle', 'premium'] },
    { name: 'Platinum Glock', description: 'Платиновый пистолет премиум класса', type: 'weapon', rarity: 'legendary', price: 0, crystalPrice: 2500, monolithLevel: 'ALPHA', weight: 0.85, damage: 30, source: ['Магазин (Кристаллы)'], tags: ['pistol', 'premium'] },
    { name: 'Diamond Armor Suit', description: 'Костюм из искусственных алмазов', type: 'armor', rarity: 'legendary', price: 0, crystalPrice: 8000, monolithLevel: 'MU', weight: 3.0, armor: 100, source: ['Магазин (Кристаллы)'], tags: ['suit', 'premium'] },
    { name: 'Exoskeleton Frame MK-V', description: 'Боевой экзоскелет V модификация', type: 'armor', rarity: 'legendary', price: 0, crystalPrice: 15000, monolithLevel: 'MU', weight: 25.0, armor: 150, source: ['Магазин (Кристаллы)'], tags: ['exo', 'premium'] },
    
    // === КВЕСТОВЫЕ ===
    { name: 'Research Data Chip', description: 'Микрочип с исследовательскими данными', type: 'quest', rarity: 'rare', price: 0, crystalPrice: 0, monolithLevel: 'GAMMA', weight: 0.01, isQuestItem: true, stackable: false, source: ['Квест'], tags: ['quest'] },
    { name: 'Encrypted Communication Device', description: 'Зашифрованное коммуникационное устройство', type: 'quest', rarity: 'epic', price: 0, crystalPrice: 0, monolithLevel: 'DELTA', weight: 0.2, isQuestItem: true, stackable: false, source: ['Квест'], tags: ['quest', 'electronics'] },
  ];

  for (const itemData of items) {
    await prisma.item.upsert({ where: { name: itemData.name }, update: itemData, create: itemData });
  }
  console.log(`✅ Items created: ${items.length}`);

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
