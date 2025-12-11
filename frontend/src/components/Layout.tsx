import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
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
    { label: 'Home', path: '/' },
    { label: 'Предметы', path: '/items' },
    { label: 'Локации', path: '/locations' },
    { label: 'Гайды', path: '/guides' },
    { label: 'Патчи', path: '/patches' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container-max flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl">🎮</div>
            <span className="font-bold text-lg gradient-text">Active Matter Wiki</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  <User size={16} />
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={16} />
                  Выход
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-800/50 backdrop-blur">
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
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
      <footer className="border-t border-gray-800 bg-gray-800/50 py-8">
        <div className="container-max px-4 text-center text-sm text-gray-400">
          <p>© 2025 Active Matter Wiki. Сделано с ❤️ для сообщества</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
