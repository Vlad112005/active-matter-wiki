import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../services/api';
import { BarChart3, TrendingUp, Users, FileText, Zap, MapPin, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user?.role?.name !== 'founder') {
      toast.error('Только Основатель может видеть дашборд');
      return;
    }
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      setStats(response.data.data);
    } catch (error: any) {
      toast.error('Ошибка загружения дашборда');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <p className="text-gray-400">Ошибка загрузки</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className={`card p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <Icon size={32} className={color.split('-')[1]} />
      </div>
    </div>
  );

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-7xl">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Founder Дашборд</h1>
              <p className="text-gray-400 text-sm mt-1">Основные метрики и аналитика</p>
            </div>
          </div>
        </div>

        {/* Карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Zap}
            label="Предметы"
            value={stats.overview.items}
            color="border-yellow-500 text-yellow-400"
          />
          <StatCard
            icon={FileText}
            label="Патчи / Новости"
            value={stats.overview.patches}
            color="border-blue-500 text-blue-400"
          />
          <StatCard
            icon={FileText}
            label="Опубликованные Материалы"
            value={stats.overview.guides}
            color="border-green-500 text-green-400"
          />
          <StatCard
            icon={Users}
            label="Пользователи"
            value={stats.overview.users}
            color="border-purple-500 text-purple-400"
          />
          <StatCard
            icon={MapPin}
            label="Локации"
            value={stats.overview.locations}
            color="border-red-500 text-red-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Общие просмотры"
            value={stats.overview.totalViews}
            color="border-cyan-500 text-cyan-400"
          />
        </div>

        {/* Топ материалов */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Top 5 Материалов</h2>
          <div className="space-y-4">
            {stats.topGuides.map((guide: any, idx: number) => (
              <div key={guide.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{guide.title}</h3>
                    <p className="text-sm text-gray-400">by {guide.author.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <ArrowUpRight size={16} />
                  <span className="font-bold">{guide.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
