import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition">
              <span className="text-white font-bold text-lg">AM</span>
            </div>
            <span className="font-bold text-xl text-white group-hover:text-cyan-400 transition">Active Matter</span>
          </Link>

          {/* Меню для рабочего стола */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/items" className="text-gray-300 hover:text-cyan-400 transition">Предметы</Link>
            <Link to="/monolith" className="text-gray-300 hover:text-cyan-400 transition">Монолит</Link>
            <Link to="/news" className="text-gray-300 hover:text-cyan-400 transition">Новости</Link>
            <Link to="/build-calculator" className="text-gray-300 hover:text-cyan-400 transition">Калькулятор</Link>
          </div>

          {/* Профиль/Вход */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role?.name === 'founder' && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition">
                    <LayoutDashboard size={18} />
                    <span>Дашборд</span>
                  </Link>
                )}
                {(user.role?.name === 'admin' || user.role?.name === 'founder') && (
                  <Link to="/admin" className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition">
                    Админ
                  </Link>
                )}
                <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-3">
                  <span className="text-sm">{user.username}</span>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition">
                Вход
              </Link>
            )}
          </div>

          {/* Мобильное меню */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильное меню */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link to="/items" className="block text-gray-300 hover:text-cyan-400 transition">Предметы</Link>
            <Link to="/monolith" className="block text-gray-300 hover:text-cyan-400 transition">Монолит</Link>
            <Link to="/news" className="block text-gray-300 hover:text-cyan-400 transition">Новости</Link>
            <Link to="/build-calculator" className="block text-gray-300 hover:text-cyan-400 transition">Калькулятор</Link>
            {user ? (
              <>
                {(user.role?.name === 'admin' || user.role?.name === 'founder') && (
                  <Link to="/admin" className="block px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg">Админ</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  Выход
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2 bg-cyan-600 text-white rounded-lg text-center">Вход</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
