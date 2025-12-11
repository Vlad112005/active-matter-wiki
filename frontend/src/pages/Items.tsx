import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Package, Search, Filter, Lock } from 'lucide-react';
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
    } finally {
      setLoading(false);
    }
  };

  const rarityColors: Record<string, string> = {
    legendary: 'from-amber-500 to-orange-500',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    uncommon: 'from-green-500 to-emerald-500',
    common: 'from-gray-600 to-gray-700',
  };

  const rarityLabels: Record<string, string> = {
    legendary: 'Легендарный',
    epic: 'Эпический',
    rare: 'Редкий',
    uncommon: 'Необычный',
    common: 'Обычный',
  };

  const typeLabels: Record<string, string> = {
    weapon: 'Оружие',
    armor: 'Броня',
    consumable: 'Расходник',
    resource: 'Ресурс',
    quest: 'Квестовый',
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
              <option value="quest">Квестовые</option>
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
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="group relative bg-[#151b2b] rounded-xl overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Изображение */}
                <div className="relative h-48">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${rarityColors[item.rarity]} flex items-center justify-center`}>
                      <Package className="w-20 h-20 text-white opacity-30" />
                    </div>
                  )}
                  
                  {/* Редкость - верхний правый угол */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-black/60 backdrop-blur-sm text-white border border-white/20`}>
                      {rarityLabels[item.rarity]}
                    </span>
                  </div>

                  {/* Уровень монолита */}
                  {item.monolithLevel && (
                    <div className="absolute top-2 left-2">
                      <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-black/60 backdrop-blur-sm text-cyan-400 border border-cyan-500/30">
                        <Lock size={12} />
                        М{item.monolithLevel}
                      </span>
                    </div>
                  )}

                  {/* Градиент внизу */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Инфо */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

                  {/* Детали */}
                  <div className="space-y-2">
                    {/* Цена жетонами */}
                    {item.price > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Жетоны:</span>
                        <span className="text-amber-400 font-semibold">{item.price}₽</span>
                      </div>
                    )}

                    {/* Тип */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Тип:</span>
                      <span className="badge text-xs">{typeLabels[item.type] || item.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
