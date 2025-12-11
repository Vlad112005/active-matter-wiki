import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Package, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');

  useEffect(() => {
    loadItems();
  }, [search, typeFilter, rarityFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Item[]>('/items', {
        params: {
          search,
          type: typeFilter || undefined,
          rarity: rarityFilter || undefined,
        },
      });
      setItems(response.data || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки предметов');
      console.error('Load items error:', error);
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

  const rarityBadge: Record<string, string> = {
    legendary: 'badge-legendary',
    epic: 'badge-epic',
    rare: 'badge-rare',
    uncommon: 'badge-uncommon',
    common: 'badge-common',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Предметы</h1>
              <p className="text-gray-400 text-sm mt-1">Полный каталог предметов в игре</p>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Поиск предметов..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 w-full"
              />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-48">
              <option value="">Все типы</option>
              <option value="weapon">Оружие</option>
              <option value="armor">Броня</option>
              <option value="consumable">Расходники</option>
              <option value="resource">Ресурсы</option>
            </select>
            <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)} className="w-full sm:w-48">
              <option value="">Все редкости</option>
              <option value="legendary">Легендарный</option>
              <option value="epic">Эпический</option>
              <option value="rare">Редкий</option>
              <option value="uncommon">Необычный</option>
              <option value="common">Обычный</option>
            </select>
          </div>
        </div>

        {/* Список предметов */}
        {items.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Предметы не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="card-interactive"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Изображение */}
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
                  <span className={`absolute top-2 right-2 ${rarityBadge[item.rarity] || 'badge'} shadow-lg`}>
                    {item.rarity}
                  </span>
                </div>

                {/* Инфо */}
                <h3 className="font-semibold mb-2 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                {/* Детали */}
                <div className="flex items-center justify-between text-sm border-t border-gray-800/50 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Цена:</span>
                    <span className="text-cyan-400 font-medium">{item.price}₽</span>
                  </div>
                  <span className="badge text-xs">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
