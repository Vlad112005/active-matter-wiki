import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Crown, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Проверка доступа к админке: moderator, admin, founder
  const hasAdminAccess = user?.role?.name && ['moderator', 'admin', 'founder'].includes(user.role.name);

  const navLinks = [
    { label: 'Главная', path: '/' },
    { label: 'Предметы', path: '/items' },
    { label: 'Локации', path: '/locations' },
    { label: 'Гайды', path: '/guides' },
    { label: 'Патчи', path: '/patches' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40">
                <span className="text-lg">🎮</span>
              </div>
              <div>
                <span className="font-semibold text-base gradient-text">Active Matter</span>
                <span className="block text-[10px] text-gray-500 -mt-0.5">Wiki</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth & Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  {user?.isPremium && (
                    <span className="premium-badge">
                      <Crown size={12} />
                      Premium
                    </span>
                  )}
                  {hasAdminAccess && (
                    <Link to="/admin" className="btn-secondary text-sm flex items-center gap-1.5">
                      <Shield size={16} />
                      Админка
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn-ghost p-2">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block btn-primary text-sm">
                  Вход
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-white/5 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/30 bg-[#0a0e1a]/95 backdrop-blur-2xl animate-slide-in">
            <div className="container-max py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {hasAdminAccess && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Админ панель
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white"
                  >
                    Выход
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-center text-sm font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Вход
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer - Legal for RU */}
      <footer className="border-t border-gray-800/30 bg-[#0f1420]/50 backdrop-blur-xl py-12 mt-auto">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-3 text-sm">Active Matter Wiki</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Информационный портал для игры Active Matter с полным каталогом предметов, локаций и гайдов.
              </p>
              <p className="text-xs text-gray-600">
                Проект не является официальным и не связан с разработчиками Active Matter.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Навигация</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link to="/items" className="hover:text-cyan-400">Предметы</Link></li>
                <li><Link to="/locations" className="hover:text-cyan-400">Локации</Link></li>
                <li><Link to="/guides" className="hover:text-cyan-400">Гайды</Link></li>
                <li><Link to="/patches" className="hover:text-cyan-400">Патчи</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Сообщество</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-cyan-400">Discord сервер</a></li>
                <li><a href="#" className="hover:text-cyan-400">Telegram канал</a></li>
                <li><a href="#" className="hover:text-cyan-400">VK группа</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm">Правовая информация</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link to="/privacy" className="hover:text-cyan-400">Политика конфиденциальности</Link></li>
                <li><Link to="/terms" className="hover:text-cyan-400">Пользовательское соглашение</Link></li>
                <li><Link to="/cookies" className="hover:text-cyan-400">Использование cookies</Link></li>
                <li><a href="mailto:support@activematter.wiki" className="hover:text-cyan-400">Связаться с нами</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800/30">
            <div className="text-xs text-gray-600 space-y-2">
              <p className="text-center">
                © 2025 Active Matter Wiki. Все права защищены.
              </p>
              <p className="text-center">
                Сайт использует файлы cookies для улучшения работы сервиса. Продолжая использовать сайт, вы соглашаетесь с{' '}
                <Link to="/cookies" className="text-cyan-400 hover:text-cyan-300">политикой использования cookies</Link>.
              </p>
              <p className="text-center text-gray-700">
                18+ • Информация на сайте не является публичной офертой • Все торговые марки принадлежат их владельцам
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
