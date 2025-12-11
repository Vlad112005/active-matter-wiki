import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Package, ArrowLeft, Lock, Coins, Sparkles, Weight, Layers, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadItem(id);
  }, [id]);

  const loadItem = async (itemId: string) => {
    try {
      const response = await apiClient.get<Item>(`/items/${itemId}`);
      setItem(response.data);
    } catch (error) {
      toast.error('Предмет не найден');
      navigate('/items');
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

  if (!item) return null;

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-5xl">
        {/* Кнопка назад */}
        <Link to="/items" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} />
          К списку предметов
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Изображение */}
          <div className="relative">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full rounded-xl shadow-2xl"
              />
            ) : (
              <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${rarityColors[item.rarity]} flex items-center justify-center shadow-2xl`}>
                <Package className="w-32 h-32 text-white opacity-30" />
              </div>
            )}

            {/* Редкость */}
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase bg-black/60 backdrop-blur-sm text-white border border-white/30 shadow-lg`}>
                {rarityLabels[item.rarity]}
              </span>
            </div>
          </div>

          {/* Информация */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-lg text-gray-300 mb-6">{item.description}</p>

            {/* Основная информация */}
            <div className="card mb-6">
              <h3 className="text-xl font-semibold mb-4">Основные характеристики</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800/50">
                  <span className="text-gray-400">Тип</span>
                  <span className="badge">{typeLabels[item.type] || item.type}</span>
                </div>

                {item.monolithLevel && (
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Lock size={16} />
                      Уровень монолита
                    </span>
                    <span className="font-semibold text-cyan-400">{item.monolithLevel}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-gray-800/50">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Weight size={16} />
                    Вес
                  </span>
                  <span className="font-semibold">{item.weight} кг</span>
                </div>

                {item.stackable && (
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800/50">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Layers size={16} />
                      Макс. стак
                    </span>
                    <span className="font-semibold">{item.maxStack}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Цены */}
            {!item.isQuestItem && (
              <div className="card mb-6">
                <h3 className="text-xl font-semibold mb-4">Стоимость</h3>
                <div className="space-y-3">
                  {item.price > 0 && (
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Coins size={18} className="text-amber-400" />
                        Жетоны
                      </span>
                      <span className="text-2xl font-bold text-amber-400">{item.price}₽</span>
                    </div>
                  )}

                  {item.silverPrice && (
                    <div className="flex items-center justify-between p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Coins size={18} className="text-gray-400" />
                        Серебро
                      </span>
                      <span className="text-2xl font-bold text-gray-300">{item.silverPrice}Аг</span>
                    </div>
                  )}

                  {item.replicationPoints && (
                    <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Sparkles size={18} className="text-cyan-400" />
                        Очки репликации
                      </span>
                      <span className="text-2xl font-bold text-cyan-400">{item.replicationPoints}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Характеристики (для оружия/брони) */}
            {(item.damage || item.armor || item.durability) && (
              <div className="card mb-6">
                <h3 className="text-xl font-semibold mb-4">Характеристики</h3>
                <div className="space-y-3">
                  {item.damage && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Урон</span>
                      <span className="font-semibold text-red-400">{item.damage}</span>
                    </div>
                  )}
                  {item.armor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Защита</span>
                      <span className="font-semibold text-blue-400">{item.armor}</span>
                    </div>
                  )}
                  {item.durability && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Прочность</span>
                      <span className="font-semibold text-green-400">{item.durability}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Источники */}
            {item.source && item.source.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-cyan-400" />
                  Где найти
                </h3>
                <ul className="space-y-2">
                  {item.source.map((source, index) => (
                    <li key={index} className="text-gray-300">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
