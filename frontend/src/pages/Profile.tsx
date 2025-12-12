import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { User, Star, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await apiClient.get('/profile/me');
      setProfile(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-20 px-4 text-center text-white py-20">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-20">
      <div className="container-max px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  {profile.isPremium && <Star className="text-yellow-400" size={24} />}
                </div>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span>Зарегистрирован: {new Date(profile.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} />
                    <span>Роль: {profile.role?.displayName || 'Пользователь'}</span>
                  </div>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h2 className="text-white font-bold mb-2">О себе</h2>
                <p className="text-gray-400">{profile.bio}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700">
              <h2 className="text-white font-bold mb-4">Статистика</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-cyan-400">{profile.stats?.guides || 0}</p>
                  <p className="text-gray-400 text-sm mt-1">Гайдов</p>
                </div>
                <div className="bg-slate-800 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-cyan-400">{profile.stats?.comments || 0}</p>
                  <p className="text-gray-400 text-sm mt-1">Комментариев</p>
                </div>
                <div className="bg-slate-800 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-cyan-400">{profile.stats?.favorites || 0}</p>
                  <p className="text-gray-400 text-sm mt-1">Избранное</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
