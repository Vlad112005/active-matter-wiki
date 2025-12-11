import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

const GuideDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useQuery({
    queryKey: ['guides', slug],
    queryFn: () => apiClient.getGuide(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="section-padding text-center">Loading...</div>;
  if (!guide) return <div className="section-padding text-center">Guide not found</div>;

  return (
    <div className="section-padding">
      <div className="container-max max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{guide.title}</h1>
        <div className="flex gap-4 mb-8 text-sm text-gray-400">
          <span>📅 {guide.category}</span>
          <span>👁️ {guide.views} views</span>
          <span>⭐ {guide.rating.toFixed(1)}</span>
        </div>
        <div className="card prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-300">{guide.content}</div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;