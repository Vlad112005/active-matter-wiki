import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
      <button
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
          language === 'ru'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
          language === 'en'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
