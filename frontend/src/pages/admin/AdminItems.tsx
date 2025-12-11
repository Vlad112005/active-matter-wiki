import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Item } from '../../types';
import { Package, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [currentLang, setCurrentLang] = useState<'ru' | 'en'>('ru');

  // Форма
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    image: '',
    type: 'weapon',
    rarity: 'common',
    price: 0,
    silverPrice: 0,
    replicationPoints: 0,
    monolithLevel: 1,
    weight: 0,
    stackable: false,
    maxStack: 1,
    source: [] as string[],
    sourceEn: [] as string[],
    tags: [] as string[],
    isQuestItem: false,
    damage: 0,
    armor: 0,
    durability: 0,
  });

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

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      type: 'weapon',
      rarity: 'common',
      price: 0,
      silverPrice: 0,
      replicationPoints: 0,
      monolithLevel: 1,
      weight: 0,
      stackable: false,
      maxStack: 1,
      source: [],
      sourceEn: [],
      tags: [],
      isQuestItem: false,
      damage: 0,
      armor: 0,
      durability: 0,
    });
    setCurrentLang('ru');
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameEn: (item as any).nameEn || '',
      description: item.description,
      descriptionEn: (item as any).descriptionEn || '',
      image: item.image || '',
      type: item.type,
      rarity: item.rarity,
      price: item.price,
      silverPrice: item.silverPrice || 0,
      replicationPoints: item.replicationPoints || 0,
      monolithLevel: item.monolithLevel || 1,
      weight: item.weight,
      stackable: item.stackable,
      maxStack: item.maxStack,
      source: item.source || [],
      sourceEn: (item as any).sourceEn || [],
      tags: item.tags || [],
      isQuestItem: item.isQuestItem,
      damage: item.damage || 0,
      armor: item.armor || 0,
      durability: item.durability || 0,
    });
    setCurrentLang('ru');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Укажите название предмета на русском');
      return;
    }

    try {
      if (editingItem) {
        await apiClient.put(`/items/${editingItem.id}`, formData);
        toast.success('Предмет обновлён');
      } else {
        await apiClient.post('/items', formData);
        toast.success('Предмет создан');
      }
      setShowModal(false);
      loadItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить предмет?')) return;

    try {
      await apiClient.delete(`/items/${id}`);
      toast.success('Предмет удалён');
      loadItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка удаления');
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Шапка */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Управление предметами</h2>
          <p className="text-sm text-gray-400 mt-1">Всего предметов: {items.length}</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Создать предмет
        </button>
      </div>

      {/* Поиск */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Поиск предметов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 w-full"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-gray-800/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium">Название</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Тип</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Редкость</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Жетоны</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Ур. Мон.</th>
                <th className="text-right py-3 px-4 text-sm font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-800/30 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge text-xs">{item.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge text-xs">{item.rarity}</span>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-semibold">{item.price}₽</td>
                  <td className="py-3 px-4 text-cyan-400">{item.monolithLevel || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#151b2b] rounded-xl max-w-4xl w-full my-8 border border-gray-800/50">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Редактировать предмет' : 'Создать предмет'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Переключатель языка */}
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentLang('ru')}
                  className={`px-4 py-2 rounded font-medium transition-all ${
                    currentLang === 'ru'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  🇷🇺 Русский (основной)
                </button>
                <button
                  onClick={() => setCurrentLang('en')}
                  className={`px-4 py-2 rounded font-medium transition-all ${
                    currentLang === 'en'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  🇬🇧 English (опционально)
                </button>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {currentLang === 'ru' ? (
                <>
                  {/* Русский */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Название *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Описание *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full h-24"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Английский */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description (English)</label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      className="w-full h-24"
                    />
                  </div>
                </>
              )}

              {/* Общие поля */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Тип</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full"
                  >
                    <option value="weapon">Оружие</option>
                    <option value="armor">Броня</option>
                    <option value="consumable">Расходник</option>
                    <option value="resource">Ресурс</option>
                    <option value="quest">Квестовый</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Редкость</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                    className="w-full"
                  >
                    <option value="common">Обычный</option>
                    <option value="uncommon">Необычный</option>
                    <option value="rare">Редкий</option>
                    <option value="epic">Эпический</option>
                    <option value="legendary">Легендарный</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Жетоны</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Серебро</label>
                  <input
                    type="number"
                    value={formData.silverPrice}
                    onChange={(e) => setFormData({ ...formData, silverPrice: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Очки репликации</label>
                  <input
                    type="number"
                    value={formData.replicationPoints}
                    onChange={(e) => setFormData({ ...formData, replicationPoints: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Уровень монолита</label>
                  <input
                    type="number"
                    value={formData.monolithLevel}
                    onChange={(e) => setFormData({ ...formData, monolithLevel: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Вес (кг)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isQuestItem}
                    onChange={(e) => setFormData({ ...formData, isQuestItem: e.target.checked })}
                  />
                  <span className="text-sm">Квестовый предмет</span>
                </label>
              </div>
            </form>

            {/* Футер */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800/50">
              <button onClick={() => setShowModal(false)} className="btn-ghost">
                Отмена
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editingItem ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItems;
