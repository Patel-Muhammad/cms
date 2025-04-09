import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllContentQuery } from '../store/api';
import ContentCard from '../components/ContentCard';
import Button from '../components/Button';

const Dashboard: React.FC = () => {
  const { data: allContent, isLoading, error } = useGetAllContentQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Content Dashboard</h1>
        <Link to="/create">
          <Button variant="primary">Create New Content</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Failed to load content</p>
        </div>
      )}

      {!isLoading && allContent && allContent.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No content found</p>
          <Link to="/create">
            <Button variant="primary">Create New Content</Button>
          </Link>
        </div>
      )}

      {!isLoading && allContent && allContent.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allContent.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
