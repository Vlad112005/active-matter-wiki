import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';

const Locations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => apiClient.getLocations({ limit: 20 }),
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-8">Локации</h1>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((location) => (
              <Link
                key={location.id}
                to={`/locations/${location.id}`}
                className="card group"
              >
                <div className="w-full h-40 bg-gray-700 rounded mb-4 flex items-center justify-center text-5xl group-hover:bg-gray-600">
                  🗺️
                </div>
                <h3 className="font-bold mb-2">{location.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {location.description}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    location.difficulty === 'easy'
                      ? 'bg-green-500/20 text-green-300'
                      : location.difficulty === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : location.difficulty === 'hard'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {location.difficulty}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
