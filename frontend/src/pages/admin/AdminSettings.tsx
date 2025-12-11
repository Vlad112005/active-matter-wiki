import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Settings, AlertCircle, Save, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [gameVersion, setGameVersion] = useState('');
  const [gameStatus, setGameStatus] = useState('beta');
  const [siteVersion, setSiteVersion] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiClient.get<SiteSetting[]>('/settings');
      const data = response.data || [];
      setSettings(data);

      // Загружаем значения в state
      data.forEach((setting) => {
        switch (setting.key) {
          case 'maintenance_mode':
            setMaintenanceMode(setting.value === 'true');
            break;
          case 'maintenance_message':
            setMaintenanceMessage(setting.value);
            break;
          case 'game_version':
            setGameVersion(setting.value);
            break;
          case 'game_status':
            setGameStatus(setting.value);
            break;
          case 'site_version':
            setSiteVersion(setting.value);
            break;
          case 'announcement':
            setAnnouncement(setting.value);
            break;
        }
      });
    } catch (error) {
      toast.error('Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await apiClient.put('/settings', { key, value });
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting('maintenance_mode', maintenanceMode.toString()),
        updateSetting('maintenance_message', maintenanceMessage),
        updateSetting('game_version', gameVersion),
        updateSetting('game_status', gameStatus),
        updateSetting('site_version', siteVersion),
        updateSetting('announcement', announcement),
      ]);
      toast.success('Настройки сохранены');
      loadSettings();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      {/* Предупреждение о режиме технических работ */}
      {maintenanceMode && (
        <div className="card bg-amber-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">Режим технических работ активен</h3>
              <p className="text-sm text-amber-300/80">
                Обычные пользователи не смогут получить доступ к сайту. Только администраторы могут войти.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Основные настройки */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Основные настройки</h2>
          <button onClick={loadSettings} className="btn-ghost" title="Обновить">
            <RotateCw size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Режим тех. работ */}
          <div className="flex items-start justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex-1">
              <label className="font-medium mb-1 block">Режим технических работ</label>
              <p className="text-sm text-gray-400">
                При включении обычные пользователи не смогут получить доступ к сайту
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                maintenanceMode ? 'bg-cyan-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Сообщение при тех. работах */}
          {maintenanceMode && (
            <div>
              <label className="block text-sm font-medium mb-2">Сообщение при технических работах</label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full h-24 resize-none"
                placeholder="Текст, который увидят пользователи..."
              />
            </div>
          )}

          {/* Версия игры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Версия игры Active Matter</label>
              <input
                type="text"
                value={gameVersion}
                onChange={(e) => setGameVersion(e.target.value)}
                placeholder="0.1.5"
                className="w-full"
              />
            </div>

            {/* Статус игры */}
            <div>
              <label className="block text-sm font-medium mb-2">Статус игры</label>
              <select value={gameStatus} onChange={(e) => setGameStatus(e.target.value)} className="w-full">
                <option value="alpha">Alpha (Альфа-тест)</option>
                <option value="beta">Beta (Бета-тест)</option>
                <option value="early-access">Early Access (Ранний доступ)</option>
                <option value="release">Release (Релиз)</option>
              </select>
            </div>
          </div>

          {/* Версия сайта */}
          <div>
            <label className="block text-sm font-medium mb-2">Версия сайта Wiki</label>
            <input
              type="text"
              value={siteVersion}
              onChange={(e) => setSiteVersion(e.target.value)}
              placeholder="1.0.0"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Отображается в футере сайта</p>
          </div>

          {/* Объявление */}
          <div>
            <label className="block text-sm font-medium mb-2">Объявление на главной странице</label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full h-24 resize-none"
              placeholder="Важное объявление для пользователей (оставьте пустым, чтобы скрыть)"
            />
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="mt-6 pt-6 border-t border-gray-800/50 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? (
              <>
                <div className="spinner" />
                Сохранение...
              </>
            ) : (
              <>
                <Save size={18} />
                Сохранить настройки
              </>
            )}
          </button>
        </div>
      </div>

      {/* Информация */}
      <div className="card bg-cyan-500/5 border-cyan-500/20">
        <h3 className="font-semibold mb-2 text-cyan-400">Информация</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Настройки применяются немедленно после сохранения</li>
          <li>• Режим тех. работ не влияет на администраторов</li>
          <li>• Версии отображаются в футере сайта</li>
          <li>• Объявление показывается на главной странице как баннер</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;
