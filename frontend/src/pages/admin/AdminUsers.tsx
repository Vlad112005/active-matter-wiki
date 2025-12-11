import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/api';
import { User, Role, UserStats } from '../../types';
import {
  Users,
  Search,
  Shield,
  Crown,
  Trash2,
  Edit,
  TrendingUp,
  UserCheck,
  BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  const isFounder = currentUser?.role?.name === 'founder';

  useEffect(() => {
    loadAll();
  }, [pagination.page, search, roleFilter]);

  const loadAll = async () => {
    try {
      const [usersRes, rolesRes, statsRes] = await Promise.all([
        apiClient.get('/users', {
          params: { page: pagination.page, limit: pagination.limit, search, role: roleFilter },
        }),
        apiClient.get<Role[]>('/users/roles/list'),
        apiClient.get<UserStats>('/users/stats/overview'),
      ]);

      setUsers(usersRes.data.data || []);
      setRoles(rolesRes.data);
      setStats(statsRes.data);
      if (usersRes.data.pagination) {
        setPagination((prev) => ({ ...prev, ...usersRes.data.pagination }));
      }
    } catch (error: any) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string) => {
    try {
      await apiClient.put(`/users/${userId}/role`, { roleId: selectedRole });
      toast.success('Роль изменена');
      setEditingUser(null);
      loadAll();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка');
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Удалить пользователя ${username}?`)) return;

    try {
      await apiClient.delete(`/users/${userId}`);
      toast.success('Пользователь удалён');
      loadAll();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка удаления');
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
      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-400">Всего пользователей</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.premium}</div>
                <div className="text-sm text-gray-400">Premium</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.recent.length}</div>
                <div className="text-sm text-gray-400">Новых за неделю</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.byRole.find((r) => r.role === 'moderator')?.count || 0}
                </div>
                <div className="text-sm text-gray-400">Модераторов</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Фильтры */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Поиск по username или email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-12 w-full"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full sm:w-48"
          >
            <option value="">Все роли</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Пользователь</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Роль</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Регистрация</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800/30 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <Link to={`/profile/${user.id}`} className="flex items-center gap-3 hover:text-cyan-400">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{user.username}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    {editingUser === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="text-sm py-1"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.displayName}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRoleChange(user.id)}
                          className="btn-primary text-xs py-1 px-2"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="btn-ghost text-xs py-1 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
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
                          {user.role.displayName}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => {
                              setEditingUser(user.id);
                              setSelectedRole(user.role.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            <Edit size={14} className="text-gray-500" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {user.isPremium && (
                      <span className="premium-badge text-xs">
                        <Crown size={10} />
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/profile/${user.id}`}
                        className="p-2 hover:bg-white/10 rounded-lg text-cyan-400"
                      >
                        <Shield size={16} />
                      </Link>
                      {isFounder && user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/50">
            <div className="text-sm text-gray-400">
              Страница {pagination.page} из {pagination.pages} (всего: {pagination.total})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                Назад
              </button>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
