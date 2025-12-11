import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Вы вошли!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold mb-2">
              {isRegister ? 'Регистрация' : 'Вход'}
            </h1>
            <p className="text-gray-400">Active Matter Wiki</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required={isRegister}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Пользователь</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded py-2 font-medium transition-colors mt-6"
            >
              {loading ? 'Обработка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-700/50 rounded text-sm text-gray-300">
            <p className="font-medium mb-2">👉 Тестовые данные:</p>
            <p>Логин: <code className="bg-gray-800 px-2 py-1 rounded">testuser</code></p>
            <p>Пароль: <code className="bg-gray-800 px-2 py-1 rounded">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
