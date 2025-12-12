import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  ru: {
    home: 'Главная',
    items: 'Предметы',
    monolith: 'Монолит',
    guides: 'Гайды',
    news: 'Новости',
    calculator: 'Калькулятор',
    login: 'Войти',
    register: 'Регистрация',
    profile: 'Профиль',
    admin: 'Админ',
  },
  en: {
    home: 'Home',
    items: 'Items',
    monolith: 'Monolith',
    guides: 'Guides',
    news: 'News',
    calculator: 'Calculator',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    admin: 'Admin',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
