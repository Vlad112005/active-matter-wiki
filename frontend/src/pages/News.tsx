import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Calendar, User, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const News = () => {
  const [patches, setPatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPatches();
  }, [page]);

  const loadPatches = async () => {
    try {
      const response = await apiClient.get('/patches', { params: { page, limit: 10 } });
      setPatches(response.data.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      toast.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        {/* Заголовок */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Новости и Обновления</h1>
              <p className="text-gray-400 text-sm mt-1">Последние обновления и патчи</p>
            </div>
          </div>
        </div>

        {/* Лист патчей */}
        <div className="space-y-6">
          {patches.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400">Новостей пока нет</p>
            </div>
          ) : (
            patches.map((patch) => (
              <div key={patch.id} className="card hover:border-cyan-500/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-3">
                      v{patch.version}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{patch.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    {formatDate(patch.publishedAt)}
                  </div>
                </div>

                <p className="text-gray-300 line-clamp-3 mb-4">{patch.content}</p>

                <button className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-lg transition">
                  Прочитать Полную
                </button>
              </div>
            ))
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 disabled:opacity-50 transition"
            >
              Предыдущая
            </button>
            <span className="text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 disabled:opacity-50 transition"
            >
              Следующая
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
