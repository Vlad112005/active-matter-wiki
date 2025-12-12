import { useState, useEffect } from 'react';
import { Users, Activity, Settings, BarChart3, FileText } from 'lucide-react';
import { apiClient } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'dashboard') {
        const res = await apiClient.get('/admin/analytics');
        setAnalytics(res.data.data);
      } else if (activeTab === 'users') {
        const res = await apiClient.get('/admin/users');
        setUsers(res.data.data);
      } else if (activeTab === 'settings') {
        const res = await apiClient.get('/admin/settings');
        setSettings(res.data.data);
      } else if (activeTab === 'activity') {
        const res = await apiClient.get('/admin/activity-logs?limit=100');
        setActivityLogs(res.data.data);
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await apiClient.put(`/admin/settings/${key}`, { value });
      toast.success('Настройка обновлена');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка обновления');
    }
  };

  if (!user || (user.role !== 'founder' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'activity', label: 'Логи', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-20">
      <div className="container-max px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">🛡️ Панель Администратора</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Загрузка...</div>
        ) : (
          <div>
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Пользователи', value: analytics.stats.users, icon: '👥' },
                    { label: 'Предметы', value: analytics.stats.items, icon: '📦' },
                    { label: 'Гайды', value: analytics.stats.guides, icon: '📖' },
                    { label: 'Новости', value: analytics.stats.patches, icon: '📰' },
                  ].map((stat, i) => (
                    <div key={i} className="card p-6 text-center">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
                      <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">📊 Топ пользователей</h2>
                  <div className="space-y-2">
                    {analytics.topUsers.map((u: any, i: number) => (
                      <div key={u.id} className="flex justify-between items-center bg-slate-800 p-3 rounded">
                        <div>
                          <span className="text-white font-semibold">{i + 1}. {u.username}</span>
                          <span className="text-gray-500 text-sm ml-2">{u.email}</span>
                        </div>
                        <span className="text-cyan-400 font-semibold">{u.loginCount} входов</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">🔥 Популярные предметы</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {analytics.popularItems.map((item: any) => (
                      <div key={item.id} className="bg-slate-800 p-3 rounded text-center">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        <p className="text-cyan-400 text-xs mt-1">👁️ {item.viewCount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Все пользователи ({users.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-3 text-gray-400">Пользователь</th>
                        <th className="pb-3 text-gray-400">Email</th>
                        <th className="pb-3 text-gray-400">Роль</th>
                        <th className="pb-3 text-gray-400">Статус</th>
                        <th className="pb-3 text-gray-400">Зарегистрирован</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-800">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {u.avatar && <img src={u.avatar} className="w-8 h-8 rounded-full" />}
                              <span className="font-semibold">{u.username}</span>
                              {u.isPremium && <span className="text-yellow-400">⭐</span>}
                            </div>
                          </td>
                          <td className="py-3 text-gray-400">{u.email}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-cyan-600 text-xs rounded">{u.role?.displayName}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded ${u.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                              {u.isActive ? 'Активен' : 'Неактивен'}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">
                            {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {Object.keys(settings).map((category) => (
                  <div key={category} className="card p-6">
                    <h2 className="text-xl font-bold text-white mb-4 capitalize">
                      {category === 'general' && '⚙️ Основные'}
                      {category === 'seo' && '🔍 SEO'}
                      {category === 'analytics' && '📊 Аналитика'}
                      {category === 'legal' && '⚖️ Юридическая информация'}
                      {category === 'social' && '💬 Социальные сети'}
                    </h2>
                    <div className="space-y-4">
                      {settings[category].map((setting: any) => (
                        <div key={setting.key} className="flex flex-col gap-2">
                          <label className="text-gray-300 text-sm font-semibold">
                            {setting.key.replace(/_/g, ' ').toUpperCase()}
                            {setting.accessLevel === 'founder' && <span className="text-yellow-400 ml-2">👑 Только основатель</span>}
                          </label>
                          {setting.description && <p className="text-gray-500 text-xs">{setting.description}</p>}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={setting.value}
                              onBlur={(e) => {
                                if (e.target.value !== setting.value) {
                                  updateSetting(setting.key, e.target.value);
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-500 outline-none"
                              disabled={setting.accessLevel === 'founder' && user?.role !== 'founder'}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ACTIVITY LOGS */}
            {activeTab === 'activity' && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Логи активности (последние 100)</h2>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-start bg-slate-800 p-3 rounded text-sm">
                      <div className="flex-1">
                        <p className="text-white font-semibold">
                          {log.user?.username || 'Система'} - {log.action}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {log.entity} {log.entityId ? `#${log.entityId}` : ''}
                        </p>
                      </div>
                      <span className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
