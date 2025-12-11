import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';

const Guides = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: () => apiClient.getGuides({ limit: 20 }),
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-8">Гайды</h1>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="card group"
              >
                <div className="w-full h-40 bg-gray-700 rounded mb-4 flex items-center justify-center text-5xl group-hover:bg-gray-600">
                  📚
                </div>
                <h3 className="font-bold mb-2">{guide.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{guide.category}</p>
                <div className="flex gap-2">
                  <span className="badge badge-primary">👁️ {guide.views}</span>
                  <span className="badge">⭐ {guide.rating.toFixed(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;