import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Package, Map, BookOpen, FileText, Settings, BarChart3 } from 'lucide-react';

const Admin = () => {
  const { user } = useAuthStore();

  // Проверка доступа
  const hasAccess = user?.role?.name && ['moderator', 'admin', 'founder'].includes(user.role.name);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    { label: 'Пользователи', value: '1,234', icon: Users, color: 'from-cyan-500 to-blue-500' },
    { label: 'Предметы', value: '450', icon: Package, color: 'from-blue-500 to-purple-500' },
    { label: 'Локации', value: '25', icon: Map, color: 'from-purple-500 to-pink-500' },
    { label: 'Гайды', value: '120', icon: BookOpen, color: 'from-pink-500 to-red-500' },
  ];

  const sections = [
    {
      title: 'Контент',
      items: [
        { label: 'Управление предметами', icon: Package, description: 'Добавить, редактировать, удалить предметы', access: ['admin', 'founder'] },
        { label: 'Управление локациями', icon: Map, description: 'Карты, описания, точки интереса', access: ['admin', 'founder'] },
        { label: 'Управление гайдами', icon: BookOpen, description: 'Создавать и модерировать гайды', access: ['moderator', 'admin', 'founder'] },
        { label: 'Патчи и обновления', icon: FileText, description: 'Публиковать информацию об обновлениях', access: ['admin', 'founder'] },
      ],
    },
    {
      title: 'Администрирование',
      items: [
        { label: 'Пользователи', icon: Users, description: 'Управление пользователями и ролями', access: ['admin', 'founder'] },
        { label: 'Аналитика', icon: BarChart3, description: 'Статистика посещений и активности', access: ['moderator', 'admin', 'founder'] },
        { label: 'Настройки', icon: Settings, description: 'Конфигурация системы', access: ['founder'] },
      ],
    },
  ];

  const hasAccessToItem = (itemAccess: string[]) => {
    return itemAccess.includes(user?.role?.name || '');
  };

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Админ панель</h1>
              <p className="text-gray-400 text-sm mt-1">
                Роль: <span className="text-cyan-400 font-medium">{user?.role?.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} style={{ animationDelay: `${200 + sectionIndex * 100}ms` }}>
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const hasAccess = hasAccessToItem(item.access);
                  return (
                    <button
                      key={item.label}
                      disabled={!hasAccess}
                      className={`card-interactive text-left ${
                        hasAccess ? '' : 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
                      }`}
                      style={{ animationDelay: `${300 + sectionIndex * 100 + itemIndex * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{item.label}</h3>
                            {!hasAccess && (
                              <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                Нет доступа
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{item.description}</p>
                          {!hasAccess && (
                            <p className="text-xs text-gray-600 mt-2">
                              Требуется роль: {item.access.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 card text-center py-12">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Админ панель в разработке</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Полноценная система управления контентом будет доступна в следующих обновлениях
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
