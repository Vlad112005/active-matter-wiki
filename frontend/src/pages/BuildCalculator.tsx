import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Item } from '../types';
import { Sword, Shield as ShieldIcon, Shirt, Backpack, Calculator, X, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface BuildSlot {
  weapon?: Item;
  armor?: Item;
  backpack?: Item;
}

const BuildCalculator = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [build, setBuild] = useState<BuildSlot>({});
  const [loading, setLoading] = useState(true);
  const [selectingSlot, setSelectingSlot] = useState<'weapon' | 'armor' | 'backpack' | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await apiClient.get<Item[]>('/items');
      setItems(response.data || []);
    } catch (error) {
      toast.error('Ошибка загрузки предметов');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredItems = () => {
    if (!selectingSlot) return [];
    
    const typeMap: Record<string, string> = {
      weapon: 'weapon',
      armor: 'armor',
      backpack: 'resource',
    };

    return items.filter((item) => item.type === typeMap[selectingSlot]);
  };

  const selectItem = (item: Item) => {
    if (!selectingSlot) return;
    setBuild({ ...build, [selectingSlot]: item });
    setSelectingSlot(null);
  };

  const removeItem = (slot: 'weapon' | 'armor' | 'backpack') => {
    const newBuild = { ...build };
    delete newBuild[slot];
    setBuild(newBuild);
  };

  // Расчёт характеристик
  const totalDamage = (build.weapon?.damage || 0);
  const totalArmor = (build.armor?.armor || 0);
  const totalWeight = (build.weapon?.weight || 0) + (build.armor?.weight || 0) + (build.backpack?.weight || 0);
  const totalCost = (build.weapon?.price || 0) + (build.armor?.price || 0) + (build.backpack?.price || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-6xl">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Калькулятор билдов</h1>
              <p className="text-gray-400 text-sm mt-1">Создай и протестируй свой идеальный билд</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Слоты снаряжения */}
          <div className="lg:col-span-2 space-y-4">
            {/* Оружие */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sword size={18} className="text-red-400" />
                  Оружие
                </h3>
                {build.weapon && (
                  <button onClick={() => removeItem('weapon')} className="btn-ghost p-2">
                    <X size={16} />
                  </button>
                )}
              </div>
              {build.weapon ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Sword className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{build.weapon.name}</div>
                    <div className="text-sm text-gray-400">Урон: {build.weapon.damage || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-semibold">{build.weapon.price}₽</div>
                    <div className="text-xs text-gray-500">{build.weapon.weight} кг</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectingSlot('weapon')}
                  className="w-full p-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-cyan-500 hover:bg-cyan-500/5 transition-all"
                >
                  <Sword className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Выбрать оружие</div>
                </button>
              )}
            </div>

            {/* Броня */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShieldIcon size={18} className="text-blue-400" />
                  Броня
                </h3>
                {build.armor && (
                  <button onClick={() => removeItem('armor')} className="btn-ghost p-2">
                    <X size={16} />
                  </button>
                )}
              </div>
              {build.armor ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <ShieldIcon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{build.armor.name}</div>
                    <div className="text-sm text-gray-400">Защита: {build.armor.armor || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-semibold">{build.armor.price}₽</div>
                    <div className="text-xs text-gray-500">{build.armor.weight} кг</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectingSlot('armor')}
                  className="w-full p-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-cyan-500 hover:bg-cyan-500/5 transition-all"
                >
                  <ShieldIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Выбрать броню</div>
                </button>
              )}
            </div>

            {/* Рюкзак */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Backpack size={18} className="text-green-400" />
                  Рюкзак
                </h3>
                {build.backpack && (
                  <button onClick={() => removeItem('backpack')} className="btn-ghost p-2">
                    <X size={16} />
                  </button>
                )}
              </div>
              {build.backpack ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Backpack className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{build.backpack.name}</div>
                    <div className="text-sm text-gray-400">Вместимость: {build.backpack.maxStack || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-semibold">{build.backpack.price}₽</div>
                    <div className="text-xs text-gray-500">{build.backpack.weight} кг</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectingSlot('backpack')}
                  className="w-full p-8 border-2 border-dashed border-gray-700 rounded-lg hover:border-cyan-500 hover:bg-cyan-500/5 transition-all"
                >
                  <Backpack className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Выбрать рюкзак</div>
                </button>
              )}
            </div>
          </div>

          {/* Характеристики */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                Итоговые характеристики
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Урон</div>
                  <div className="text-3xl font-bold text-red-400">{totalDamage}</div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Защита</div>
                  <div className="text-3xl font-bold text-blue-400">{totalArmor}</div>
                </div>

                <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Общий вес</div>
                  <div className="text-2xl font-bold text-gray-300">{totalWeight.toFixed(1)} кг</div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Стоимость билда</div>
                  <div className="text-2xl font-bold text-amber-400">{totalCost}₽</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800/50">
                <button
                  onClick={() => setBuild({})}
                  className="btn-secondary w-full"
                  disabled={!build.weapon && !build.armor && !build.backpack}
                >
                  Сбросить билд
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно выбора предмета */}
        {selectingSlot && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#151b2b] rounded-xl max-w-4xl w-full my-8 border border-gray-800/50">
              <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                <h3 className="text-xl font-bold">Выбрать {selectingSlot === 'weapon' ? 'оружие' : selectingSlot === 'armor' ? 'броню' : 'рюкзак'}</h3>
                <button onClick={() => setSelectingSlot(null)} className="p-2 hover:bg-white/10 rounded">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {getFilteredItems().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectItem(item)}
                    className="text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="font-semibold mb-2">{item.name}</div>
                    <div className="text-sm text-gray-400 mb-2 line-clamp-2">{item.description}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-400">{item.price}₽</span>
                      {item.damage && <span className="text-red-400">Урон: {item.damage}</span>}
                      {item.armor && <span className="text-blue-400">Защита: {item.armor}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildCalculator;
