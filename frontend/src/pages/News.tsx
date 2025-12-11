import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Newspaper, Calendar, TrendingUp, Wrench, Bug, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PatchChange {
  id: string;
  type: string;
  description: string;
  descriptionEn?: string;
}

interface Patch {
  id: string;
  version: string;
  title: string;
  titleEn?: string;
  releaseDate: string;
  content: string;
  contentEn?: string;
  changes: PatchChange[];
}

const News = () => {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatches();
  }, []);

  const loadPatches = async () => {
    try {
      const response = await apiClient.get<Patch[]>('/patches');
      setPatches(response.data || []);
    } catch (error) {
      toast.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Sparkles size={16} className="text-green-400" />;
      case 'changed':
        return <Wrench size={16} className="text-blue-400" />;
      case 'fixed':
        return <Bug size={16} className="text-cyan-400" />;
      case 'removed':
        return <Trash2 size={16} className="text-red-400" />;
      default:
        return <TrendingUp size={16} className="text-gray-400" />;
    }
  };

  const getChangeLabel = (type: string) => {
    const labels: Record<string, string> = {
      added: 'Добавлено',
      changed: 'Изменено',
      fixed: 'Исправлено',
      removed: 'Удалено',
    };
    return labels[type] || type;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl shadow-cyan-500/25">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Новости и обновления</h1>
              <p className="text-gray-400 text-sm mt-1">История всех патчей игры Active Matter</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {patches.length === 0 ? (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Новостей пока нет</h3>
            <p className="text-gray-400">Скоро здесь появятся обновления игры</p>
          </div>
        ) : (
          <div className="space-y-8">
            {patches.map((patch, index) => (
              <div
                key={patch.id}
                className="card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Хедер патча */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-sm">
                        v{patch.version}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                          LATEST
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{patch.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      {formatDate(patch.releaseDate)}
                    </div>
                  </div>
                </div>

                {/* Описание */}
                {patch.content && (
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">{patch.content}</p>
                  </div>
                )}

                {/* Изменения */}
                {patch.changes && patch.changes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">Список изменений:</h3>
                    <div className="space-y-3">
                      {patch.changes.map((change) => (
                        <div key={change.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="mt-0.5">{getChangeIcon(change.type)}</div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-gray-500 mb-1">
                              {getChangeLabel(change.type)}
                            </div>
                            <div className="text-sm text-gray-300">{change.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
