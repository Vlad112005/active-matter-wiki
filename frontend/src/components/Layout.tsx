import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Crown } from 'lucide-react';
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

  const navLinks = [
    { label: 'Главная', path: '/' },
    { label: 'Предметы', path: '/items' },
    { label: 'Локации', path: '/locations' },
    { label: 'Гайды', path: '/guides' },
    { label: 'Патчи', path: '/patches' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 p-2 rounded-lg">
                  <span className="text-xl">🎮</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-lg gradient-text">Active Matter</span>
                <span className="block text-xs text-gray-500">Wiki</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-900/50 rounded-lg transition-all text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth & Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  {user?.isPremium && (
                    <span className="premium-badge">
                      <Crown size={12} />
                      Premium
                    </span>
                  )}
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-sm font-medium transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <User size={16} />
                    Админка
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all text-sm"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-medium transition-all shadow-lg shadow-cyan-500/20"
                >
                  Вход
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-900/50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl animate-slide-in">
            <div className="container-max py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Админ панель
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm"
                  >
                    Выход
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-center transition-colors text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Вход
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm py-8 mt-auto">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-cyan-400 mb-4">Active Matter Wiki</h3>
              <p className="text-sm text-gray-400">
                Информационный портал для игры Active Matter с полным каталогом предметов, локаций и гайдов.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/items" className="hover:text-cyan-400 transition-colors">Предметы</Link></li>
                <li><Link to="/locations" className="hover:text-cyan-400 transition-colors">Локации</Link></li>
                <li><Link to="/guides" className="hover:text-cyan-400 transition-colors">Гайды</Link></li>
                <li><Link to="/patches" className="hover:text-cyan-400 transition-colors">Патчи</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Сообщество</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Reddit</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">О проекте</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Поддержка</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800/50 text-center text-sm text-gray-500">
            <p>© 2025 Active Matter Wiki. Сделано с ❤️ для сообщества</p>
            <p className="mt-2">Не связано с официальными разработчиками Active Matter</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
