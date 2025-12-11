import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Unlock, Coins, Diamond, Package, Wrench, Zap, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface MonolithUnlock {
  id: string;
  type: string;
  itemId?: string;
  item?: any;
  upgradeName?: string;
  upgradeCost?: number;
  recipeName?: string;
  chronoName?: string;
  isLocked: boolean;
}

interface MonolithLevel {
  id: string;
  code: string;
  order: number;
  name: string;
  nameEn?: string;
  requiredTokens?: number;
  requiredCrystals?: number;
  unlocks: MonolithUnlock[];
}

const Monolith = () => {
  const { user } = useAuthStore();
  const [levels, setLevels] = useState<MonolithLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const isFounder = user?.role?.name === 'founder';

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const response = await apiClient.get<MonolithLevel[]>('/monolith/levels');
      setLevels(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedLevel(response.data[0].code);
      }
    } catch (error) {
      toast.error('Ошибка загрузки уровней монолита');
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = levels.find(l => l.code === selectedLevel);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-7xl">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
                <Unlock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Уровни доступа монолита</h1>
                <p className="text-gray-400 text-sm mt-1">Всё что открывается на каждом уровне</p>
              </div>
            </div>
            {isFounder && (
              <button
                onClick={() => toast.info('Редактирование будет добавлено в админ-панели')}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                <span>Управление монолитом</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Боковое меню уровней */}
          <div className="lg:col-span-1">
            <div className="card p-0 sticky top-24">
              <div className="p-4 border-b border-gray-800/50">
                <h3 className="font-semibold">Уровни допуска</h3>
              </div>
              <div className="space-y-1 p-2">
                {levels.map((level) => {
                  const isLocked = level.requiredTokens && level.requiredTokens > 0;
                  return (
                    <button
                      key={level.code}
                      onClick={() => setSelectedLevel(level.code)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedLevel === level.code
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{level.code}</span>
                        {isLocked ? (
                          <span className="text-xs text-amber-400">{level.requiredTokens} жетонов</span>
                        ) : (
                          <Unlock size={14} className="text-green-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Контент уровня */}
          <div className="lg:col-span-3">
            {currentLevel ? (
              <div>
                {/* Шапка уровня */}
                <div className="card mb-6">
                  <h2 className="text-2xl font-bold mb-4">{currentLevel.name}</h2>
                  
                  {/* Требования */}
                  {(currentLevel.requiredTokens && currentLevel.requiredTokens > 0) || (currentLevel.requiredCrystals && currentLevel.requiredCrystals > 0) ? (
                    <div className="flex items-center gap-4 mb-4">
                      {currentLevel.requiredTokens > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <Coins size={18} className="text-amber-400" />
                          <span className="font-semibold text-amber-400">{currentLevel.requiredTokens}</span>
                          <span className="text-xs text-gray-400">жетонов монолита</span>
                        </div>
                      )}
                      {currentLevel.requiredCrystals && currentLevel.requiredCrystals > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <Diamond size={18} className="text-purple-400" />
                          <span className="font-semibold text-purple-400">{currentLevel.requiredCrystals}</span>
                          <span className="text-xs text-gray-400">кристаллов АМ</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                      <p className="text-green-400 text-sm font-medium">✅ Доступно сразу</p>
                    </div>
                  )}
                </div>

                {/* Что открывается */}
                {currentLevel.unlocks && currentLevel.unlocks.length > 0 ? (
                  <div>
                    {/* Доступ к покупкам */}
                    {currentLevel.unlocks.some(u => u.type === 'item') && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Доступ к покупкам в магазине:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLevel.unlocks.filter(u => u.type === 'item').map((unlock) => (
                            <div key={unlock.id} className="card hover:border-cyan-500/30 transition-all cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Package size={16} className="text-cyan-400" />
                                  <div>
                                    <div className="font-medium text-sm">{unlock.item?.name || 'Предмет'}</div>
                                    {unlock.item?.type && (
                                      <div className="text-xs text-gray-500 capitalize">{unlock.item.type}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {unlock.item?.price > 0 && (
                                    <span className="text-blue-400 font-semibold text-xs flex items-center gap-1">
                                      {unlock.item.price} кред.
                                    </span>
                                  )}
                                  {unlock.item?.crystalPrice > 0 && (
                                    <span className="text-purple-400 font-semibold text-xs flex items-center gap-1">
                                      <Diamond size={12} />
                                      {unlock.item.crystalPrice}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Улучшения убежища */}
                    {currentLevel.unlocks.some(u => u.type === 'upgrade') && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Улучшения убежища:</h3>
                        <div className="space-y-2">
                          {currentLevel.unlocks.filter(u => u.type === 'upgrade').map((unlock) => (
                            <div key={unlock.id} className="card">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Wrench size={16} className="text-green-400" />
                                  <span className="text-gray-300">{unlock.upgradeName}</span>
                                </div>
                                {unlock.upgradeCost && (
                                  <span className="text-blue-400 font-semibold text-sm">
                                    {unlock.upgradeCost} кред.
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Рецепты переработчика */}
                    {currentLevel.unlocks.some(u => u.type === 'recipe') && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Рецепты переработчика:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLevel.unlocks.filter(u => u.type === 'recipe').map((unlock) => (
                            <div key={unlock.id} className="card">
                              <div className="flex items-center gap-3">
                                <Zap size={16} className="text-purple-400" />
                                <span className="text-gray-300 text-sm">{unlock.recipeName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Хроногены */}
                    {currentLevel.unlocks.some(u => u.type === 'chrono') && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Хроногены:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentLevel.unlocks.filter(u => u.type === 'chrono').map((unlock) => (
                            <div key={unlock.id} className="card">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Zap size={16} className="text-cyan-400" />
                                  <span className="text-gray-300 text-sm">{unlock.chronoName}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Пока пусто</h3>
                    <p className="text-gray-400">Информация об этом уровне будет добавлена позже</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-400">Выберите уровень монолита</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monolith;
