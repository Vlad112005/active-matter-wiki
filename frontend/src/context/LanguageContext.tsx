import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

// Переводы
const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Навигация
    'nav.home': 'Главная',
    'nav.items': 'Предметы',
    'nav.locations': 'Локации',
    'nav.guides': 'Гайды',
    'nav.patches': 'Патчи',
    'nav.admin': 'Админка',
    'nav.profile': 'Мой профиль',
    'nav.login': 'Вход',
    'nav.logout': 'Выход',

    // Типы предметов
    'item.type.weapon': 'Оружие',
    'item.type.armor': 'Броня',
    'item.type.consumable': 'Расходник',
    'item.type.resource': 'Ресурс',
    'item.type.quest': 'Квестовый',

    // Редкость
    'rarity.legendary': 'Легендарный',
    'rarity.epic': 'Эпический',
    'rarity.rare': 'Редкий',
    'rarity.uncommon': 'Необычный',
    'rarity.common': 'Обычный',

    // Предметы
    'items.title': 'Предметы',
    'items.subtitle': 'Полный каталог предметов в игре',
    'items.search': 'Поиск предметов...',
    'items.all_types': 'Все типы',
    'items.all_rarities': 'Все редкости',
    'items.not_found': 'Предметы не найдены',
    'items.try_filters': 'Попробуйте изменить фильтры',
    'items.tokens': 'Жетоны',
    'items.type': 'Тип',
    'items.back': 'К списку предметов',
    'items.monolith_level': 'Уровень монолита',
    'items.weight': 'Вес',
    'items.max_stack': 'Макс. стак',
    'items.cost': 'Стоимость',
    'items.silver': 'Серебро',
    'items.replication_points': 'Очки репликации',
    'items.characteristics': 'Характеристики',
    'items.damage': 'Урон',
    'items.armor': 'Защита',
    'items.durability': 'Прочность',
    'items.where_to_find': 'Где найти',
    'items.no_translation': '⚠️ Перевод на английский пока недоступен',

    // Общие
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.items': 'Items',
    'nav.locations': 'Locations',
    'nav.guides': 'Guides',
    'nav.patches': 'Patches',
    'nav.admin': 'Admin',
    'nav.profile': 'My Profile',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Item types
    'item.type.weapon': 'Weapon',
    'item.type.armor': 'Armor',
    'item.type.consumable': 'Consumable',
    'item.type.resource': 'Resource',
    'item.type.quest': 'Quest Item',

    // Rarity
    'rarity.legendary': 'Legendary',
    'rarity.epic': 'Epic',
    'rarity.rare': 'Rare',
    'rarity.uncommon': 'Uncommon',
    'rarity.common': 'Common',

    // Items
    'items.title': 'Items',
    'items.subtitle': 'Complete item catalog in the game',
    'items.search': 'Search items...',
    'items.all_types': 'All types',
    'items.all_rarities': 'All rarities',
    'items.not_found': 'Items not found',
    'items.try_filters': 'Try changing filters',
    'items.tokens': 'Tokens',
    'items.type': 'Type',
    'items.back': 'Back to items list',
    'items.monolith_level': 'Monolith Level',
    'items.weight': 'Weight',
    'items.max_stack': 'Max Stack',
    'items.cost': 'Cost',
    'items.silver': 'Silver',
    'items.replication_points': 'Replication Points',
    'items.characteristics': 'Characteristics',
    'items.damage': 'Damage',
    'items.armor': 'Armor',
    'items.durability': 'Durability',
    'items.where_to_find': 'Where to Find',
    'items.no_translation': '⚠️ English translation not available yet',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
};

// Определение языка по региону
const detectLanguage = (): Language => {
  // Проверяем localStorage
  const saved = localStorage.getItem('language');
  if (saved === 'ru' || saved === 'en') return saved;

  // Автоопределение по браузеру
  const browserLang = navigator.language.toLowerCase();
  
  // СНГ страны
  const cisCodes = ['ru', 'uk', 'be', 'kk', 'ky', 'uz', 'tj', 'tm', 'az', 'hy', 'ka'];
  
  for (const code of cisCodes) {
    if (browserLang.startsWith(code)) return 'ru';
  }

  return 'en';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
