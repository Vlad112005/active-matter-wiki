import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuthStore();
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
      if (isRegister) {
        if (!formData.email || !formData.username || !formData.password) {
          toast.error('Заполните все поля');
          return;
        }
        await register(formData.email, formData.username, formData.password);
        toast.success('Регистрация успешна!');
      } else {
        if (!formData.username || !formData.password) {
          toast.error('Заполните все поля');
          return;
        }
        await login(formData.username, formData.password);
        toast.success('Вы вошли!');
      }
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Ошибка. Попробуйте снова';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 items-center justify-center mb-4 shadow-xl shadow-cyan-500/25">
            <span className="text-3xl">🎮</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isRegister ? 'Создать аккаунт' : 'Войти в Active Matter'}
          </h1>
          <p className="text-sm text-gray-500">
            {isRegister
              ? 'Заполните данные для регистрации'
              : 'Введите свои данные'}
          </p>
        </div>

        <div className="card">
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
              <label className="block text-sm font-medium mb-2">
                {isRegister ? 'Имя пользователя' : 'Email или Username'}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder={isRegister ? 'username' : 'email или username'}
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
              className="w-full btn-primary mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner"></span>
                  Обработка...
                </span>
              ) : isRegister ? (
                'Зарегистрироваться'
              ) : (
                'Войти'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setFormData({ email: '', username: '', password: '' });
              }}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              {isRegister
                ? 'Уже есть аккаунт? Войти'
                : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 glass rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-gray-400">
              <p className="font-medium text-white mb-1">Тестовый аккаунт:</p>
              <p>Username: <code className="text-cyan-400">testuser</code></p>
              <p>Password: <code className="text-cyan-400">password123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
