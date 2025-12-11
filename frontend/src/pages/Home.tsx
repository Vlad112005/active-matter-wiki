import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Package, BookOpen, Map, Calendar, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

interface Stats {
  items: number;
  locations: number;
  guides: number;
  patches: number;
  users: number;
  lastGameUpdate: string;
  lastGameVersion: string;
  lastSiteUpdate: string;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([
        apiClient.get<Item[]>('/items', { params: { limit: 6 } }),
        apiClient.get<Stats>('/stats'),
      ]);
      setItems(itemsRes.data || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays} дн. назад`;
    if (diffHours > 0) return `${diffHours} ч. назад`;
    if (diffMins > 0) return `${diffMins} мин. назад`;
    return 'только что';
  };

  const rarityColors: Record<string, string> = {
    legendary: 'from-amber-500 to-orange-500',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    uncommon: 'from-green-500 to-emerald-500',
    common: 'from-gray-600 to-gray-700',
  };

  return (
    <div className="bg-[#0a0e1a]">
      {/* Hero Section */}
      <section className="hero-gradient py-20 sm:py-28">
        <div className="container-max text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 animate-fade-in">
            <Sparkles size={16} className="text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">
              Версия игры: {settings.game_version} ({settings.game_status.toUpperCase()})
            </span>
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
            <Link to="/build-calculator" className="btn-secondary text-base px-8 py-3">
              Калькулятор билдов
            </Link>
          </div>
        </div>
      </section>

      {/* Динамическая статистика */}
      <section className="py-12 border-y border-gray-800/30 bg-[#0f1420]/50">
        <div className="container-max">
          {loading || !stats ? (
            <div className="flex items-center justify-center h-32">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in">
                <Package className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold">{stats.items}</div>
                <div className="text-sm text-gray-400">Предметов</div>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <Map className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold">{stats.locations}</div>
                <div className="text-sm text-gray-400">Локаций</div>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold">{stats.guides}</div>
                <div className="text-sm text-gray-400">Гайдов</div>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-xl font-bold text-green-400">
                  {stats.lastGameUpdate ? getTimeAgo(stats.lastGameUpdate) : 'Недавно'}
                </div>
                <div className="text-sm text-gray-400">Обновление игры</div>
                {stats.lastGameVersion && (
                  <div className="text-xs text-gray-600 mt-1">v{stats.lastGameVersion}</div>
                )}
              </div>
            </div>
          )}

          {/* Дополнительная инфо */}
          {stats && (
            <div className="mt-8 pt-8 border-t border-gray-800/30">
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-cyan-400" />
                  <span>Сайт обновлён: {getTimeAgo(stats.lastSiteUpdate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{stats.users} пользователей</span>
                </div>
              </div>
            </div>
          )}
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
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="group relative bg-[#151b2b] rounded-xl overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-40">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${rarityColors[item.rarity]} flex items-center justify-center`}>
                        <Package className="w-16 h-16 text-white opacity-30" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      {item.price > 0 && <span className="text-amber-400 font-semibold">{item.price}₽</span>}
                      <span className="badge text-xs ml-auto">{item.type}</span>
                    </div>
                  </div>
                </Link>
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
