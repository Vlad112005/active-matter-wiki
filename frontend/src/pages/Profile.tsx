import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../services/api';
import { User } from '../types';
import { User as UserIcon, Edit2, Save, X, Calendar, Mail, Shield, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
  });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      setUser(response.data);
      setFormData({
        username: response.data.username,
        bio: response.data.bio || '',
        avatarUrl: response.data.avatarUrl || '',
      });
    } catch (error) {
      toast.error('Пользователь не найден');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiClient.put('/users/profile', formData);
      toast.success('Профиль обновлён');
      setEditing(false);
      loadUser();
      // Обновляем данные в store
      await useAuthStore.getState().refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка обновления');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        {/* Шапка профиля */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Аватар */}
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <UserIcon size={40} className="text-white" />
                  </div>
                )}
                {user.isPremium && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Crown size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Инфо */}
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="text-2xl font-bold mb-2 w-full"
                    placeholder="Имя пользователя"
                  />
                ) : (
                  <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-lg font-medium ${
                      user.role.name === 'founder'
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20'
                        : user.role.name === 'admin'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : user.role.name === 'moderator'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : user.role.name === 'premium'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}
                  >
                    <Shield size={12} className="inline mr-1" />
                    {user.role.displayName}
                  </span>
                  {user.isPremium && (
                    <span className="premium-badge">
                      <Crown size={12} />
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопки */}
            {isOwnProfile && (
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} className="btn-primary">
                      <Save size={16} className="mr-1.5" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          username: user.username,
                          bio: user.bio || '',
                          avatarUrl: user.avatarUrl || '',
                        });
                      }}
                      className="btn-ghost"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-secondary">
                    <Edit2 size={16} className="mr-1.5" />
                    Редактировать
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Био */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">О себе</h3>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full h-24 resize-none"
                placeholder="Расскажите о себе..."
              />
            ) : (
              <p className="text-gray-300">
                {user.bio || 'Пользователь пока не добавил описание'}
              </p>
            )}
          </div>

          {/* Информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800/50">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-gray-500" />
              <span className="text-gray-400">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-gray-400">Регистрация: {joinedDate}</span>
            </div>
          </div>

          {/* URL аватара (при редактировании) */}
          {editing && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Ссылка на аватар</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Гайды пользователя */}
        {user.guides && user.guides.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Гайды ({user.guides.length})</h2>
            <div className="space-y-3">
              {user.guides.map((guide) => (
                <Link
                  key={guide.id}
                  to={`/guides/${guide.slug}`}
                  className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-gray-800/50 hover:border-cyan-500/20"
                >
                  <h3 className="font-medium text-white">{guide.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
