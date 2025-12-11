import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Package, BookOpen, Map, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    loadFeaturedItems();
  }, []);

  const loadFeaturedItems = async () => {
    try {
      const response = await apiClient.get<Item[]>('/items', { params: { limit: 6 } });
      setItems(response.data || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColors: Record<string, string> = {
    legendary: 'from-amber-500 to-orange-500',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    uncommon: 'from-green-500 to-emerald-500',
    common: 'from-gray-500 to-gray-600',
  };

  const stats = [
    { label: 'Предметов', value: '450+', icon: Package },
    { label: 'Локаций', value: '25+', icon: Map },
    { label: 'Гайдов', value: '120+', icon: BookOpen },
    { label: 'Обновлений', value: 'Еженедельно', icon: TrendingUp },
  ];

  return (
    <div className="bg-[#0a0e1a]">
      {/* Hero Section */}
      <section className="hero-gradient py-20 sm:py-28">
        <div className="container-max text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 animate-fade-in">
            <Sparkles size={16} className="text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Версия игры: {settings.game_version} ({settings.game_status.toUpperCase()})</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in">
            Полный гайд по
            <br />
            <span className="gradient-text">Active Matter</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: '100ms' }}>
            Информационный портал с полным каталогом предметов, локаций, гайдов и механик
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <Link to="/items" className="btn-primary text-base px-8 py-3">
              Изучить предметы
            </Link>
            <Link to="/guides" className="btn-secondary text-base px-8 py-3">
              Читать гайды
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-800/30 bg-[#0f1420]/50">
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Популярные предметы */}
      <section className="section-padding">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Популярные предметы</h2>
              <p className="text-gray-400">Самые искомые предметы в игре</p>
            </div>
            <Link to="/items" className="btn-secondary hidden sm:flex items-center gap-2">
              Все предметы
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(0, 6).map((item, index) => (
                <div
                  key={item.id}
                  className="card-interactive"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative mb-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div
                        className={`w-full h-48 rounded-lg bg-gradient-to-br ${rarityColors[item.rarity] || 'from-gray-700 to-gray-800'} flex items-center justify-center`}
                      >
                        <Package className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 badge shadow-lg ${item.rarity === 'legendary' ? 'badge-legendary' : item.rarity === 'epic' ? 'badge-epic' : item.rarity === 'rare' ? 'badge-rare' : 'badge'}`}>
                      {item.rarity}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between text-sm border-t border-gray-800/50 pt-3">
                    <span className="text-cyan-400 font-medium">{item.price}₽</span>
                    <span className="badge text-xs">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/items" className="btn-secondary inline-flex items-center gap-2">
              Все предметы
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Быстрый доступ */}
      <section className="py-16 bg-[#0f1420]/50">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/items" className="card-interactive">
              <Package className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Каталог предметов</h3>
              <p className="text-sm text-gray-400">Полная информация о всех предметах в игре</p>
            </Link>

            <Link to="/locations" className="card-interactive">
              <Map className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Карты локаций</h3>
              <p className="text-sm text-gray-400">Детальные карты и гайды по локациям</p>
            </Link>

            <Link to="/guides" className="card-interactive">
              <BookOpen className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Обучающие гайды</h3>
              <p className="text-sm text-gray-400">Экспертные гайды от опытных игроков</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
