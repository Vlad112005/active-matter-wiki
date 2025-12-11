import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

const Patches = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['patches'],
    queryFn: () => apiClient.getPatches({ limit: 20 }),
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-8">Патч-ноты</h1>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-6">
            {data?.data?.map((patch) => (
              <div key={patch.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{patch.title}</h3>
                    <p className="text-gray-400 text-sm">v{patch.version}</p>
                  </div>
                  <span className="text-gray-400">{
                    new Date(patch.releaseDate).toLocaleDateString('ru-RU')
                  }</span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{patch.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patches;