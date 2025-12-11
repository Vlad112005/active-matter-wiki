import { Construction, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MaintenanceProps {
  message?: string;
}

const Maintenance = ({ message }: MaintenanceProps) => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center mb-8 shadow-2xl shadow-amber-500/25 animate-pulse">
          <Construction className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Технические работы</h1>

        <p className="text-xl text-gray-300 mb-8">
          {message || 'Сайт находится на технических работах. Скоро вернёмся!'}
        </p>

        <div className="card inline-block">
          <p className="text-sm text-gray-400 mb-4">
            Мы работаем над улучшением сервиса. Приносим извинения за временные неудобства.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home size={18} />
            Вернуться на главную
          </Link>
        </div>

        <div className="mt-12 text-xs text-gray-600">
          <p>Если вы администратор, вы можете войти в систему</p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
