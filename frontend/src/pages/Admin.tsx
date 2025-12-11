import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Package, Map, BookOpen, FileText, Settings, BarChart3 } from 'lucide-react';
import AdminUsers from './admin/AdminUsers';

const Admin = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('users');

  const hasAccess = user?.role?.name && ['moderator', 'admin', 'founder'].includes(user.role.name);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'users', label: 'Пользователи', icon: Users, access: ['admin', 'founder'] },
    { id: 'items', label: 'Предметы', icon: Package, access: ['admin', 'founder'] },
    { id: 'locations', label: 'Локации', icon: Map, access: ['admin', 'founder'] },
    { id: 'guides', label: 'Гайды', icon: BookOpen, access: ['moderator', 'admin', 'founder'] },
    { id: 'patches', label: 'Патчи', icon: FileText, access: ['admin', 'founder'] },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3, access: ['moderator', 'admin', 'founder'] },
    { id: 'settings', label: 'Настройки', icon: Settings, access: ['founder'] },
  ];

  const hasTabAccess = (tabAccess: string[]) => {
    return tabAccess.includes(user?.role?.name || '');
  };

  const availableTabs = tabs.filter((tab) => hasTabAccess(tab.access));

  return (
    <div className="section-padding bg-[#0a0e1a] min-h-screen">
      <div className="container-max">
        {/* Шапка */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Админ панель</h1>
              <p className="text-gray-400 text-sm mt-1">
                Роль: <span className="text-cyan-400 font-medium">{user?.role?.displayName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="card p-0 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Контент */}
        <div className="animate-fade-in">
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'items' && (
            <div className="card text-center py-12">
              <Package className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Управление предметами</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
          {activeTab === 'locations' && (
            <div className="card text-center py-12">
              <Map className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Управление локациями</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
          {activeTab === 'guides' && (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Управление гайдами</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
          {activeTab === 'patches' && (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Управление патчами</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="card text-center py-12">
              <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="card text-center py-12">
              <Settings className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Настройки системы</h3>
              <p className="text-gray-400">В разработке...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
