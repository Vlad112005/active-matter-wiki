import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: location, isLoading } = useQuery({
    queryKey: ['locations', id],
    queryFn: () => apiClient.getLocation(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="section-padding text-center">Loading...</div>;
  if (!location) return <div className="section-padding text-center">Location not found</div>;

  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
        <div className="card mb-8 h-96 flex items-center justify-center text-9xl">🗺️</div>
        <p className="text-gray-400 mb-8">{location.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-bold mb-2">Difficulty</h3>
            <p>{location.difficulty}</p>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">Enemies</h3>
            <p>{location.enemies?.length || 0} types</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;