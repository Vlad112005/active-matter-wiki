import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Zap, Scroll, Compass, Users, TrendingUp, Award, Clock } from 'lucide-react';
import { apiClient } from '../services/api';

const Home = () => {
  const { data: itemsData } = useQuery({
    queryKey: ['items', 'featured'],
    queryFn: () => apiClient.getItems({ limit: 8 }),
  });

  const { data: guidesData } = useQuery({
    queryKey: ['guides', 'featured'],
    queryFn: () => apiClient.getGuides({ limit: 3 }),
  });

  const stats = [
    { icon: Zap, label: 'Предметов', value: '450+', color: 'from-cyan-500 to-blue-500' },
    { icon: Compass, label: 'Локаций', value: '25', color: 'from-blue-500 to-purple-500' },
    { icon: Scroll, label: 'Гайдов', value: '120+', color: 'from-purple-500 to-pink-500' },
    { icon: Users, label: 'Игроков', value: '50K+', color: 'from-pink-500 to-red-500' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6 animate-slide-in">
              <TrendingUp size={16} />
              Обновлено для патча 0.9.2
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in">
              <span className="gradient-text">Погрузитесь в мир</span>
              <br />
              <span className="text-white">Active Matter</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-slide-in">
              Полный каталог предметов, детальные карты локаций и экспертные гайды для выживания в петле времени
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
              <Link
                to="/items"
                className="btn-primary px-8 py-3 text-lg inline-flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Открыть каталог
              </Link>
              <Link
                to="/guides"
                className="btn-secondary px-8 py-3 text-lg inline-flex items-center justify-center gap-2"
              >
                <Scroll size={20} />
                Читать гайды
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-950">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="card text-center group hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section-padding bg-gray-900/30">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Популярные предметы</h2>
              <p className="text-gray-400">Самое востребованное снаряжение</p>
            </div>
            <Link
              to="/items"
              className="hidden sm:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Смотреть все
              <TrendingUp size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {itemsData?.data?.slice(0, 8).map((item, index) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="card-interactive"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:from-gray-700 group-hover:to-gray-800 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="text-5xl relative z-10">📦</span>
                  {item.rarity === 'legendary' && (
                    <div className="absolute top-2 right-2">
                      <Award className="text-amber-400" size={20} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2 min-h-[40px]">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`badge badge-${item.rarity}`}>{item.type}</span>
                  <span className="badge badge-primary">💰 {item.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/items"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Смотреть все предметы
              <TrendingUp size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section-padding bg-gray-950">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Лучшие гайды</h2>
              <p className="text-gray-400">Проверенные стратегии от экспертов</p>
            </div>
            <Link
              to="/guides"
              className="hidden sm:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Все гайды
              <Scroll size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidesData?.data?.slice(0, 3).map((guide, index) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="card-interactive"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:from-cyan-800/30 group-hover:to-blue-800/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <span className="text-6xl relative z-10">📚</span>
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="badge badge-primary text-xs">{guide.category}</span>
                  </div>
                </div>
                <h3 className="font-bold mb-3 text-lg line-clamp-2 min-h-[56px]">{guide.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {guide.views.toLocaleString()} просм.
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ {guide.rating.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/guides"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Все гайды
              <Scroll size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-y border-gray-800/50">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold mb-4">Готовы к выживанию?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам игроков, которые используют нашу вики для достижения успеха в Active Matter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3 inline-flex items-center justify-center gap-2">
              Начать сейчас
            </Link>
            <Link to="/guides" className="btn-secondary px-8 py-3 inline-flex items-center justify-center gap-2">
              Узнать больше
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
