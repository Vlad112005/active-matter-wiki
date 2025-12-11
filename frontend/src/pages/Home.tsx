import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Zap, Scroll, Compass, Users } from 'lucide-react';
import { apiClient } from '../services/api';

const Home = () => {
  const { data: itemsData } = useQuery({
    queryKey: ['items', 'featured'],
    queryFn: () => apiClient.getItems({ limit: 4 }),
  });

  const { data: guidesData } = useQuery({
    queryKey: ['guides', 'featured'],
    queryFn: () => apiClient.getGuides({ limit: 3 }),
  });

  const stats = [
    { icon: Zap, label: 'Предметов', value: '450+' },
    { icon: Compass, label: 'Локаций', value: '25' },
    { icon: Scroll, label: 'Гайдов', value: '120+' },
    { icon: Users, label: 'Персонажей', value: '50+' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-800">
        <div className="container-max text-center">
          <div className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Пробудитесь в мире</span>
            <br />
            <span>Active Matter</span>
          </div>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Полные гайды, каталоги предметов и стратегии для эксплореров
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/items"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Открыть каталог
            </Link>
            <Link
              to="/guides"
              className="px-6 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition-colors"
            >
              Прочитать гайды
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card text-center">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                  <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section-padding bg-gray-800">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-8">Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {itemsData?.data?.slice(0, 4).map((item) => (
              <Link key={item.id} to={`/items/${item.id}`} className="card group">
                <div className="w-full h-32 bg-gray-700 rounded mb-4 flex items-center justify-center text-4xl group-hover:bg-gray-600">
                  📈
                </div>
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`badge badge-${item.rarity}`}>{item.type}</span>
                  <span className="badge badge-primary">💰 {item.price}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/items"
              className="inline-block px-6 py-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              Смотреть все предметы
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="section-padding bg-gray-900">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-8">Latest Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidesData?.data?.slice(0, 3).map((guide) => (
              <Link key={guide.id} to={`/guides/${guide.slug}`} className="card group">
                <div className="w-full h-40 bg-gray-700 rounded mb-4 flex items-center justify-center text-5xl group-hover:bg-gray-600">
                  📚
                </div>
                <h3 className="font-bold mb-2">{guide.title}</h3>
                <p className="text-xs text-gray-400 mb-3">👁️ {guide.views} views • ⭐ {guide.rating.toFixed(1)}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="badge badge-primary">{guide.category}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/guides"
              className="inline-block px-6 py-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              Смотреть все гайды
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
