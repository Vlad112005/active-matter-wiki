import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiClient } from '../services/api';

const Items = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [rarity, setRarity] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['items', { search, type, rarity, page }],
    queryFn: () =>
      apiClient.getItems({
        page,
        limit: 12,
        type: type || undefined,
        rarity: rarity || undefined,
      }),
  });

  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-8">Предметы</h1>

        {/* Filters */}
        <div className="card mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-700 rounded px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="">All Types</option>
            <option value="weapon">Оружие</option>
            <option value="armor">Армор</option>
            <option value="consumable">Потребляемые</option>
            <option value="quest">Квест</option>
          </select>

          <select
            value={rarity}
            onChange={(e) => {
              setRarity(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="">All Rarities</option>
            <option value="common">Обычные</option>
            <option value="uncommon">Необычные</option>
            <option value="rare">Редкие</option>
            <option value="epic">Эпик</option>
            <option value="legendary">Легендарные</option>
          </select>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {data?.data?.map((item) => (
                <Link key={item.id} to={`/items/${item.id}`} className="card group">
                  <div className="w-full h-32 bg-gray-700 rounded mb-4 flex items-center justify-center text-4xl group-hover:bg-gray-600">
                    📈
                  </div>
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-primary">{item.type}</span>
                    <span className={`badge badge-${item.rarity}`}>
                      {item.rarity}
                    </span>
                    <span className="badge">💰 {item.price}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Prev
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }).map(
                    (_, i) => {
                      const pageNum =
                        page <= 2 ? i + 1 : page >= data.pagination.pages - 2 ? data.pagination.pages - 4 + i : page - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 rounded ${
                            page === pageNum
                              ? 'bg-blue-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() => setPage(Math.min(data.pagination.pages, page + 1))}
                  disabled={page === data.pagination.pages}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Items;
