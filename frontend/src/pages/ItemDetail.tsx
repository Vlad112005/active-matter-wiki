import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useQuery({
    queryKey: ['items', id],
    queryFn: () => apiClient.getItem(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="section-padding text-center">Loading...</div>;
  if (!item) return <div className="section-padding text-center">Item not found</div>;

  return (
    <div className="section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card h-80 flex items-center justify-center text-8xl">📈</div>
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-gray-400 mb-6">{item.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-gray-400">Type:</span> <span>{item.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Rarity:</span> <span>{item.rarity}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Price:</span> <span>💰 {item.price}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Weight:</span> <span>{item.weight}kg</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;