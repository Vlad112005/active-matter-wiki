import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const legalDocs = {
  terms: {
    title: 'Пользовательское соглашение',
    content: `# ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ

**Дата вступления в силу:** 12 декабря 2025 г.

## 1. ОБЩИЕ ПОЛОЖЕНИЯ

1.1. Настоящее Пользовательское соглашение (далее - «Соглашение») регулирует отношения между ИП [ВАШЕ ИМЯ] (далее - «Администрация») и пользователем сайта active-matter-wiki.ru (далее - «Пользователь», «Вы»).

1.2. Использование сайта означает безоговорочное согласие Пользователя с настоящим Соглашением и указанными в нем условиями.

1.3. Администрация вправе вносить изменения в Соглашение без какого-либо специального уведомления.

## 2. ПРЕДМЕТ СОГЛАШЕНИЯ

2.1. Администрация предоставляет Пользователю доступ к информационным ресурсам сайта, включая:
- Базу данных игровых предметов
- Гайды и руководства
- Инструменты для планирования игры
- Новости и обновления

2.2. Все материалы сайта предоставляются «как есть» без каких-либо гарантий.

## 3. РЕГИСТРАЦИЯ И УЧЕТНАЯ ЗАПИСЬ

3.1. Для доступа к некоторым функциям необходима регистрация.

3.2. При регистрации Пользователь обязуется предоставить достоверную информацию.

3.3. Пользователь несет ответственность за сохранность своих данных для входа.

## 4. ПРАВА И ОБЯЗАННОСТИ СТОРОН

### 4.1. Пользователь обязуется:
- Соблюдать законодательство РФ
- Не размещать незаконный контент
- Уважать права других пользователей
- Не использовать автоматизированные средства сбора данных

### 4.2. Администрация вправе:
- Изменять или прекращать работу сервиса
- Удалять контент, нарушающий Соглашение
- Блокировать учетные записи нарушителей

## 5. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ

5.1. Все материалы сайта защищены авторским правом.

5.2. Использование материалов без письменного согласия запрещено.

## 6. ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ

6.1. Сайт предоставляется «как есть» без гарантий полноты и точности информации.

6.2. Администрация не несет ответственности за:
- Временную недоступность сервиса
- Потерю данных
- Косвенные убытки

## 7. РАЗРЕШЕНИЕ СПОРОВ

7.1. Все споры разрешаются путем переговоров.

7.2. При недостижении согласия спор передается в суд по месту нахождения Администрации.

## 8. ПРИМЕНИМОЕ ПРАВО

8.1. К настоящему Соглашению применяется право Российской Федерации.

## 9. КОНТАКТЫ

По вопросам Соглашения: legal@activematter.wiki
`,
    version: '1.0.0',
  },
  privacy: {
    title: 'Политика конфиденциальности',
    content: `# ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ

**В соответствии с Федеральным законом № 152-ФЗ «О персональных данных»**

**Дата вступления в силу:** 12 декабря 2025 г.

## 1. ОБЩИЕ ПОЛОЖЕНИЯ

1.1. Настоящая Политика конфиденциальности (далее - «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта active-matter-wiki.ru.

1.2. Оператор персональных данных: ИП [ВАШЕ ИМЯ], ОГРНИП [НОМЕР].

1.3. Адрес оператора: [ВАШ АДРЕС].

## 2. ПЕРСОНАЛЬНЫЕ ДАННЫЕ

### 2.1. Мы собираем следующие данные:
- Email адрес
- Имя пользователя (логин)
- IP-адрес
- Файлы cookies
- Данные о действиях на сайте

### 2.2. Правовые основания обработки:
- Федеральный закон № 152-ФЗ «О персональных данных»
- Федеральный закон № 149-ФЗ «Об информации»
- Ваше добровольное согласие

## 3. ЦЕЛИ ОБРАБОТКИ ДАННЫХ

3.1. Персональные данные обрабатываются для:
- Регистрации и авторизации
- Связи с пользователем
- Улучшения качества сервиса
- Аналитики и статистики
- Защиты от мошенничества

## 4. ОБРАБОТКА ПЕРСОНАЛЬНЫХ ДАННЫХ

4.1. Обработка осуществляется с использованием средств автоматизации.

4.2. Способы обработки:
- Сбор
- Запись
- Систематизация
- Накопление
- Хранение
- Уточнение (обновление, изменение)
- Извлечение
- Использование
- Удаление

4.3. Срок хранения: до момента отзыва согласия или удаления аккаунта.

## 5. ЗАЩИТА ПЕРСОНАЛЬНЫХ ДАННЫХ

5.1. Применяемые меры:
- Шифрование паролей (bcrypt, 12 раундов)
- HTTPS протокол
- Защита от SQL-инъекций
- Регулярное резервное копирование
- Ограничение доступа сотрудников

5.2. Хранение на защищенных серверах в дата-центрах РФ.

## 6. ПЕРЕДАЧА ТРЕТЬИМ ЛИЦАМ

6.1. Мы НЕ продаем и НЕ передаем ваши данные третьим лицам без согласия.

6.2. Исключения:
- По требованию государственных органов (в рамках закона)
- При объединении/реорганизации компании

## 7. ВАШИ ПРАВА (ст. 14 ФЗ-152)

Вы имеете право:
- Получать информацию об обработке своих данных
- Требовать уточнения неверных данных
- Требовать удаления данных
- Отозвать согласие на обработку
- Обжаловать действия оператора в Роскомнадзоре или суде

## 8. COOKIES И ТЕХНОЛОГИИ ОТСЛЕЖИВАНИЯ

8.1. Мы используем cookies для:
- Аутентификации
- Сохранения настроек
- Аналитики (Яндекс.Метрика)

8.2. Вы можете отключить cookies в браузере.

## 9. ЯНДЕКС.МЕТРИКА

9.1. На сайте используется Яндекс.Метрика.

9.2. Собираемые данные:
- Посещенные страницы
- Время на сайте
- Источник перехода
- Технические данные (разрешение экрана, браузер)

9.3. Политика конфиденциальности Яндекс: https://yandex.ru/legal/confidential/

## 10. ИЗМЕНЕНИЯ В ПОЛИТИКЕ

10.1. Администрация вправе вносить изменения в Политику.

10.2. Новая версия вступает в силу с момента публикации.

## 11. СОГЛАСИЕ НА ОБРАБОТКУ

11.1. Регистрируясь на сайте, Вы даете согласие на обработку персональных данных.

11.2. Согласие может быть отозвано письменным заявлением на email: privacy@activematter.wiki

## 12. КОНТАКТЫ

**Оператор персональных данных:**
ИП [ВАШЕ ИМЯ]
ОГРНИП: [НОМЕР]
Адрес: [ВАШ АДРЕС]
Email: privacy@activematter.wiki

**Контакты Роскомнадзора:**
Тел: +7 (495) 531-88-00
Сайт: https://rkn.gov.ru
`,
    version: '1.0.0',
  },
  cookies: {
    title: 'Политика использования файлов Cookie',
    content: `# ПОЛИТИКА ИСПОЛЬЗОВАНИЯ ФАЙЛОВ COOKIE

**Дата вступления в силу:** 12 декабря 2025 г.

## 1. ЧТО ТАКОЕ COOKIES?

Cookies - небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении сайта.

## 2. КАКИЕ COOKIES МЫ ИСПОЛЬЗУЕМ

### 2.1. Обязательные cookies
- **auth_token** - токен авторизации (срок: 30 дней)
- **session_id** - идентификатор сессии (срок: 24 часа)

### 2.2. Функциональные cookies
- **theme** - выбранная тема оформления
- **language** - выбранный язык интерфейса

### 2.3. Аналитические cookies
- **_ym_uid**, **_ym_d** - Яндекс.Метрика (срок: 1 год)

## 3. ЦЕЛИ ИСПОЛЬЗОВАНИЯ

3.1. Обязательные cookies:
- Авторизация пользователей
- Защита от CSRF-атак
- Сохранение корзины

3.2. Функциональные cookies:
- Запоминание настроек
- Персонализация интерфейса

3.3. Аналитические cookies:
- Понимание поведения пользователей
- Улучшение сервиса
- Оптимизация контента

## 4. УПРАВЛЕНИЕ COOKIES

### 4.1. Chrome:
1. Меню → Настройки → Конфиденциальность и безопасность
2. Файлы cookie и другие данные сайтов
3. Управление cookies

### 4.2. Firefox:
1. Меню → Параметры → Приватность и защита
2. Куки и данные сайтов
3. Управление данными

### 4.3. Safari:
1. Меню → Параметры → Конфиденциальность
2. Управление данными веб-сайтов

### 4.4. Edge:
1. Меню → Параметры → Конфиденциальность
2. Файлы cookie и разрешения сайтов

## 5. ПОСЛЕДСТВИЯ ОТКЛЮЧЕНИЯ COOKIES

При отключении cookies:
- ❌ Невозможна авторизация
- ❌ Сбрасываются настройки
- ✅ Базовый просмотр сайта работает

## 6. ТРЕТЬИ СТОРОНЫ

### 6.1. Яндекс.Метрика
**Cookies:** _ym_uid, _ym_d, _ym_isad, _ym_visorc
**Цель:** Аналитика трафика
**Политика:** https://yandex.ru/legal/confidential/

## 7. ЗАКОНОДАТЕЛЬСТВО РФ

7.1. Использование cookies регулируется:
- Федеральный закон № 152-ФЗ
- Федеральный закон № 149-ФЗ
- Требования Роскомнадзора

## 8. КОНТАКТЫ

Вопросы по cookies: cookies@activematter.wiki
`,
    version: '1.0.0',
  },
};

async function main() {
  console.log('🚀 Starting comprehensive database seed...');

  try {
    // CLEAN ALL DATA
    console.log('\n🗑️  Cleaning existing data...');
    await prisma.userConsent.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.session.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.guideVersion.deleteMany();
    await prisma.guide.deleteMany();
    await prisma.monolithUnlock.deleteMany();
    await prisma.patch.deleteMany();
    await prisma.item.deleteMany();
    await prisma.monolithLevel.deleteMany();
    await prisma.location.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.legalDocument.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    console.log('✅ Data cleaned');

    // 1. ROLES
    console.log('\n👥 Creating roles...');
    const founderRole = await prisma.role.create({
      data: {
        name: 'founder',
        displayName: 'Основатель',
        description: 'Полный доступ ко всем функциям',
        priority: 100,
        permissions: JSON.stringify({
          admin: true,
          settings: true,
          analytics: true,
          users: { view: true, edit: true, delete: true },
          items: { view: true, create: true, edit: true, delete: true },
          guides: { view: true, create: true, edit: true, delete: true, publish: true },
          legal: { view: true, edit: true },
        }),
      },
    });

    await prisma.role.create({
      data: {
        name: 'admin',
        displayName: 'Администратор',
        description: 'Управление контентом',
        priority: 80,
        permissions: JSON.stringify({
          admin: true,
          items: { view: true, create: true, edit: true, delete: true },
          guides: { view: true, create: true, edit: true, delete: true },
        }),
      },
    });

    await prisma.role.create({
      data: {
        name: 'moderator',
        displayName: 'Модератор',
        priority: 60,
      },
    });

    await prisma.role.create({
      data: {
        name: 'content_manager',
        displayName: 'Контент-менеджер',
        priority: 50,
      },
    });

    await prisma.role.create({
      data: {
        name: 'user',
        displayName: 'Пользователь',
        priority: 10,
      },
    });
    console.log('✅ Roles created');

    // 2. FOUNDER USER
    console.log('\n🔑 Creating founder...');
    const hashedPassword = await bcrypt.hash('ActiveMatter2025!', 12);
    const founder = await prisma.user.create({
      data: {
        username: 'Founder',
        email: 'founder@activematter.wiki',
        password: hashedPassword,
        roleId: founderRole.id,
        bio: 'Основатель Active Matter Wiki',
        emailVerified: true,
        isActive: true,
      },
    });
    console.log('✅ Founder created:', founder.email);

    // 3. LEGAL DOCUMENTS
    console.log('\n📜 Creating legal documents...');
    await prisma.legalDocument.create({
      data: {
        type: 'terms',
        ...legalDocs.terms,
        published: true,
        effectiveAt: new Date(),
        updatedBy: founder.id,
      },
    });

    await prisma.legalDocument.create({
      data: {
        type: 'privacy',
        ...legalDocs.privacy,
        published: true,
        effectiveAt: new Date(),
        updatedBy: founder.id,
      },
    });

    await prisma.legalDocument.create({
      data: {
        type: 'cookies',
        ...legalDocs.cookies,
        published: true,
        effectiveAt: new Date(),
        updatedBy: founder.id,
      },
    });
    console.log('✅ Legal documents created');

    // 4. SITE SETTINGS
    console.log('\n⚙️  Creating site settings...');
    const settings = [
      // General
      { key: 'site_name', value: 'Active Matter Wiki', category: 'general', description: 'Название сайта' },
      { key: 'site_description', value: 'Полная энциклопедия по игре Active Matter', category: 'general' },
      { key: 'site_version', value: '1.0.0', category: 'general' },
      { key: 'maintenance_mode', value: 'false', category: 'general' },
      
      // SEO
      { key: 'seo_title', value: 'Active Matter Wiki - Гайды, предметы, стратегии', category: 'seo' },
      { key: 'seo_keywords', value: 'active matter, вики, гайды, предметы, монолит', category: 'seo' },
      
      // Analytics
      { key: 'yandex_metrika_id', value: '', category: 'analytics', description: 'ID счётчика Яндекс.Метрики', accessLevel: 'founder' },
      { key: 'google_analytics_id', value: '', category: 'analytics', accessLevel: 'founder' },
      
      // Legal
      { key: 'company_name', value: 'ИП [ВАШЕ ИМЯ]', category: 'legal', accessLevel: 'founder' },
      { key: 'ogrn', value: '', category: 'legal', accessLevel: 'founder' },
      { key: 'inn', value: '', category: 'legal', accessLevel: 'founder' },
      { key: 'legal_address', value: '', category: 'legal', accessLevel: 'founder' },
      
      // Social
      { key: 'discord_invite', value: '', category: 'social' },
      { key: 'telegram_channel', value: '', category: 'social' },
      { key: 'vk_group', value: '', category: 'social' },
    ];

    for (const setting of settings) {
      await prisma.siteSettings.create({
        data: { ...setting, updatedBy: founder.id },
      });
    }
    console.log('✅ Site settings created');

    // 5. MONOLITH LEVELS
    console.log('\n⚡ Creating monolith levels...');
    const levels = [
      { code: 'ALPHA', order: 1, name: 'Уровень: АЛЬФА', nameEn: 'Level: ALPHA', requiredTokens: 100, requiredCrystals: 0 },
      { code: 'BETA', order: 2, name: 'Уровень: БЕТА', nameEn: 'Level: BETA', requiredTokens: 500, requiredCrystals: 200 },
      { code: 'GAMMA', order: 3, name: 'Уровень: ГАММА', nameEn: 'Level: GAMMA', requiredTokens: 750, requiredCrystals: 225 },
      { code: 'DELTA', order: 4, name: 'Уровень: ДЕЛЬТА', nameEn: 'Level: DELTA', requiredTokens: 1300, requiredCrystals: 260 },
      { code: 'EPSILON', order: 5, name: 'Уровень: ЭПСИЛОН', nameEn: 'Level: EPSILON', requiredTokens: 2400, requiredCrystals: 310 },
      { code: 'DZETA', order: 6, name: 'Уровень: ДЗЕТА', nameEn: 'Level: DZETA', requiredTokens: 4250, requiredCrystals: 375 },
      { code: 'ETA', order: 7, name: 'Уровень: ЭТА', nameEn: 'Level: ETA', requiredTokens: 7000, requiredCrystals: 475 },
      { code: 'THETA', order: 8, name: 'Уровень: ТЕТА', nameEn: 'Level: THETA', requiredTokens: 10800, requiredCrystals: 600 },
      { code: 'IOTA', order: 9, name: 'Уровень: ЙОТА', nameEn: 'Level: IOTA', requiredTokens: 15900, requiredCrystals: 775 },
      { code: 'KAPPA', order: 10, name: 'Уровень: КАППА', nameEn: 'Level: KAPPA', requiredTokens: 22350, requiredCrystals: 1050 },
      { code: 'LAMBDA', order: 11, name: 'Уровень: ЛЯМБДА', nameEn: 'Level: LAMBDA', requiredTokens: 30500, requiredCrystals: 1500 },
      { code: 'MU', order: 12, name: 'Уровень: МЮ', nameEn: 'Level: MU', requiredTokens: 40000, requiredCrystals: 2200 },
    ];

    for (const level of levels) {
      await prisma.monolithLevel.create({ data: level });
    }
    console.log('✅ Monolith levels created');

    // 6. ITEMS
    console.log('\n📦 Creating items...');
    const items = [
      { name: 'Glock 19', description: 'Компактный пистолет 9мм', type: 'weapon', rarity: 'common', price: 8500, monolithLevel: 'ALPHA', weight: 0.85, damage: 25, source: ['Магазин'], sourceEn: ['Shop'], tags: ['pistol'] },
      { name: 'AK-103', description: 'Штурмовая винтовка', type: 'weapon', rarity: 'rare', price: 17500, monolithLevel: 'ALPHA', weight: 3.6, damage: 45, source: ['Магазин'], sourceEn: ['Shop'], tags: ['rifle'] },
      { name: 'Remington 870', description: 'Дробовое ружьё', type: 'weapon', rarity: 'common', price: 6500, monolithLevel: 'ALPHA', weight: 3.8, damage: 50, source: ['Магазин'], sourceEn: ['Shop'], tags: ['shotgun'] },
      { name: '9x19 Parabellum', description: 'Патрон 9mm', type: 'resource', rarity: 'common', price: 50, monolithLevel: 'ALPHA', weight: 0.01, stackable: true, maxStack: 9999, source: ['Магазин'], sourceEn: ['Shop'], tags: ['ammo'] },
      { name: 'UTAS Body Armor', description: 'Керамическая защита', type: 'armor', rarity: 'uncommon', price: 15000, monolithLevel: 'BETA', weight: 2.5, armor: 35, source: ['Магазин'], sourceEn: ['Shop'], tags: ['vest'] },
      { name: 'Combat Helmet', description: 'Боевой шлем', type: 'armor', rarity: 'common', price: 3500, monolithLevel: 'ALPHA', weight: 1.2, armor: 15, source: ['Магазин'], sourceEn: ['Shop'], tags: ['helmet'] },
      { name: 'Multi-tool', description: 'Многофункциональный нож', type: 'tool', rarity: 'common', price: 1200, monolithLevel: 'ALPHA', weight: 0.2, source: ['Магазин'], sourceEn: ['Shop'], tags: ['utility'] },
      { name: 'First Aid Kit', description: 'Набор первой помощи', type: 'consumable', rarity: 'common', price: 800, monolithLevel: 'ALPHA', weight: 0.5, source: ['Магазин'], sourceEn: ['Shop'], tags: ['medical'] },
      { name: 'Monolith Token', description: 'Жетон доступа монолита', type: 'special', rarity: 'epic', price: 0, monolithLevel: 'ALPHA', weight: 0.01, isQuestItem: false, stackable: true, maxStack: 999, source: ['Монолит'], sourceEn: ['Monolith'], tags: ['token'] },
      { name: 'AM Crystal', description: 'Кристалл активной материи', type: 'special', rarity: 'legendary', price: 0, crystalPrice: 50, monolithLevel: 'BETA', weight: 0.05, isQuestItem: false, stackable: true, maxStack: 999, source: ['Лут'], sourceEn: ['Loot'], tags: ['crystal'] },
    ];

    for (const item of items) {
      await prisma.item.create({ data: item });
    }
    console.log('✅ Items created:', items.length);

    // 7. PATCHES
    console.log('\n📰 Creating patches...');
    await prisma.patch.create({
      data: {
        version: 'v1.0.0',
        title: 'Запуск Active Matter Wiki',
        content: '🎉 Официальная вики запущена! Теперь доступны:\n- Полная база предметов\n- Система монолита\n- Гайды от игроков\n- Калькулятор сборок',
        type: ['new'],
        published: true,
        publishedAt: new Date(),
      },
    });
    console.log('✅ Patches created');

    console.log('\n✨ ========================================');
    console.log('   DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================\n');
    console.log('🔐 Founder credentials:');
    console.log('   Email: founder@activematter.wiki');
    console.log('   Password: ActiveMatter2025!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
