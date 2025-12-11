import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Unlock, Plus, Edit, Trash2, Lock, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

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
  requiredCredits?: number;
  unlocks: MonolithUnlock[];
}

const AdminMonolith = () => {
  const [levels, setLevels] = useState<MonolithLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLevel, setEditingLevel] = useState<MonolithLevel | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    order: 1,
    name: '',
    nameEn: '',
    requiredTokens: 0,
    requiredCredits: 0,
  });

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const response = await apiClient.get('/monolith/levels');
      setLevels(response.data || []);
    } catch (error) {
      toast.error('Ошибка загрузки уровней монолита');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingLevel(null);
    setFormData({
      code: '',
      order: levels.length + 1,
      name: '',
      nameEn: '',
      requiredTokens: 0,
      requiredCredits: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (level: MonolithLevel) => {
    setEditingLevel(level);
    setFormData({
      code: level.code,
      order: level.order,
      name: level.name,
      nameEn: level.nameEn || '',
      requiredTokens: level.requiredTokens || 0,
      requiredCredits: level.requiredCredits || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    try {
      if (editingLevel) {
        await apiClient.put(`/monolith/levels/${editingLevel.id}`, formData);
        toast.success('Уровень обновлён');
      } else {
        await apiClient.post('/monolith/levels', formData);
        toast.success('Уровень создан');
      }
      setShowModal(false);
      loadLevels();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить уровень монолита? Это также удалит все связанные разблокировки.')) return;

    try {
      await apiClient.delete(`/monolith/levels/${id}`);
      toast.success('Уровень удалён');
      loadLevels();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка удаления');
    }
  };

  const moveLevel = async (levelId: string, direction: 'up' | 'down') => {
    try {
      await apiClient.post(`/monolith/levels/${levelId}/move`, { direction });
      loadLevels();
    } catch (error) {
      toast.error('Ошибка перемещения');
    }
  };

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
          <h2 className="text-2xl font-bold">Управление уровнями монолита</h2>
          <p className="text-sm text-gray-400 mt-1">Всего уровней: {levels.length}</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Создать уровень
        </button>
      </div>

      {/* Список уровней */}
      <div className="space-y-4">
        {levels.map((level, index) => (
          <div key={level.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-sm">
                    {level.code}
                  </span>
                  <h3 className="font-semibold text-lg">{level.name}</h3>
                  {level.order > 8 && (
                    <Lock size={16} className="text-red-400" title="Заблокирован" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Требования:</div>
                    <div className="flex items-center gap-3">
                      {level.requiredTokens && (
                        <span className="text-amber-400 font-semibold">{level.requiredTokens}₽ жетонов</span>
                      )}
                      {level.requiredCredits && (
                        <span className="text-blue-400 font-semibold">{level.requiredCredits} кредитов</span>
                      )}
                      {!level.requiredTokens && !level.requiredCredits && (
                        <span className="text-gray-500">Нет требований</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-1">Разблокировок:</div>
                    <div className="text-gray-300">
                      {level.unlocks?.length || 0} предметов/улучшений
                    </div>
                  </div>
                </div>
              </div>

              {/* Действия */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveLevel(level.id, 'up')}
                  disabled={index === 0}
                  className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Переместить вверх"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveLevel(level.id, 'down')}
                  disabled={index === levels.length - 1}
                  className="p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Переместить вниз"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => openEditModal(level)}
                  className="p-2 hover:bg-white/10 rounded"
                  title="Редактировать"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(level.id)}
                  className="p-2 hover:bg-red-500/10 text-red-400 rounded"
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151b2b] rounded-xl max-w-2xl w-full border border-gray-800/50">
            <div className="p-6 border-b border-gray-800/50">
              <h3 className="text-xl font-bold">
                {editingLevel ? 'Редактировать уровень' : 'Создать уровень'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Код уровня *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full"
                    placeholder="ALPHA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Порядковый номер *</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Название (RU) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                  placeholder="Уровень допуска: АЛЬФА"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Название (EN)</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full"
                  placeholder="Access Level: ALPHA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Требуется жетонов</label>
                  <input
                    type="number"
                    value={formData.requiredTokens}
                    onChange={(e) => setFormData({ ...formData, requiredTokens: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Требуется кредитов</label>
                  <input
                    type="number"
                    value={formData.requiredCredits}
                    onChange={(e) => setFormData({ ...formData, requiredCredits: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800/50">
              <button onClick={() => setShowModal(false)} className="btn-ghost">
                Отмена
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editingLevel ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMonolith;
