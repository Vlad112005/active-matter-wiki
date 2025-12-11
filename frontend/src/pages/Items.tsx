import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Package } from 'lucide-react';
import { apiClient } from '../services/api';

const Items = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [rarity, setRarity] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['items', { search, type, rarity, page }],
    queryFn: () =>
      apiClient.getItems({
        page,
        limit: 12,
        type: type || undefined,
        rarity: rarity || undefined,
      }),
  });

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      legendary: 'from-amber-500 to-orange-500',
      epic: 'from-purple-500 to-pink-500',
      rare: 'from-blue-500 to-cyan-500',
      uncommon: 'from-green-500 to-emerald-500',
      common: 'from-gray-500 to-gray-600',
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="section-padding bg-gray-950">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Каталог предметов</h1>
              <p className="text-gray-400 mt-1">Полный список снаряжения и ресурсов</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Поиск предметов..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-800 rounded-lg appearance-none cursor-pointer hover:border-cyan-500/50 transition-colors min-w-[140px]"
                >
                  <option value="">Все типы</option>
                  <option value="weapon">Оружие</option>
                  <option value="armor">Броня</option>
                  <option value="consumable">Расходники</option>
                  <option value="quest">Квестовые</option>
                  <option value="other">Прочее</option>
                </select>
              </div>

              <select
                value={rarity}
                onChange={(e) => {
                  setRarity(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg appearance-none cursor-pointer hover:border-cyan-500/50 transition-colors min-w-[140px]"
              >
                <option value="">Редкость</option>
                <option value="common">Обычные</option>
                <option value="uncommon">Необычные</option>
                <option value="rare">Редкие</option>
                <option value="epic">Эпик</option>
                <option value="legendary">Легендарные</option>
              </select>
            </div>
          </div>

          {(search || type || rarity) && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Фильтры:</span>
                {search && (
                  <span className="badge badge-primary">
                    🔍 {search}
                  </span>
                )}
                {type && (
                  <span className="badge badge-primary">
                    📦 {type}
                  </span>
                )}
                {rarity && (
                  <span className="badge badge-primary">
                    ✨ {rarity}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearch('');
                    setType('');
                    setRarity('');
                    setPage(1);
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Сбросить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block spinner w-8 h-8 border-4"></div>
            <p className="text-gray-400 mt-4">Загрузка предметов...</p>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="card text-center py-20">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">Предметы не найдены</p>
            <p className="text-gray-500 mt-2">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {data?.data?.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/items/${item.id}`}
                  className="card-interactive group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="relative w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform">📦</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`badge badge-${item.rarity} text-xs font-semibold`}>
                        {item.rarity}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="badge">{item.type}</span>
                    <span className="text-cyan-400 font-semibold">💰 {item.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Назад
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }).map((_, i) => {
                    const pageNum = page <= 2 ? i + 1 : page >= data.pagination.pages - 2 ? data.pagination.pages - 4 + i : page - 2 + i;
                    if (pageNum < 1 || pageNum > data.pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(Math.min(data.pagination.pages, page + 1))}
                  disabled={page === data.pagination.pages}
                  className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Вперёд →
                </button>
              </div>
            )}

            {data?.pagination && (
              <div className="text-center mt-6 text-sm text-gray-500">
                Показано {data.data?.length || 0} из {data.pagination.total} предметов
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Items;
