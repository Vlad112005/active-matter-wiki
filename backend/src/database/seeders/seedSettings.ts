import { prisma } from '../client.js';

const settings = [
  {
    key: 'maintenance_mode',
    value: 'false',
    description: 'Режим технических работ (true/false)',
  },
  {
    key: 'maintenance_message',
    value: 'Сайт находится на технических работах. Скоро вернёмся!',
    description: 'Сообщение при тех. работах',
  },
  {
    key: 'game_version',
    value: '0.1.5',
    description: 'Текущая версия игры Active Matter',
  },
  {
    key: 'game_status',
    value: 'beta',
    description: 'Статус игры (alpha/beta/release)',
  },
  {
    key: 'site_version',
    value: '1.0.0',
    description: 'Версия сайта',
  },
  {
    key: 'announcement',
    value: '',
    description: 'Объявление на главной странице',
  },
];

const main = async () => {
  console.log('Seeding site settings...');

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }

  console.log('✅ Site settings seeded successfully');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
