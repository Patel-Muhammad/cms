
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetContentByIdQuery } from '../store/api';
import Button from '../components/Button';

const ViewContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: content, isLoading, error } = useGetContentByIdQuery(id || '');
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Content not found or an error occurred</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  const renderContentBasedOnType = () => {
    switch (content.contentType) {
      case 'text':
        return (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Content</h3>
            <div className="prose max-w-none">
              {content.content}
            </div>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Quiz Questions</h3>
            <div className="space-y-6">
              {content.questions.map((question, index) => (
                <div key={question.id} className="border-b pb-4 last:border-0">
                  <p className="font-medium mb-2">Question {index + 1}: {question.question}</p>
                  <ul className="space-y-2 ml-4">
                    {question.options.map(option => (
                      <li 
                        key={option.id} 
                        className={`p-2 rounded ${option.id === question.correctOptionId ? 'bg-green-100' : ''}`}
                      >
                        {option.text} {option.id === question.correctOptionId && <span className="text-green-600 ml-2">(Correct Answer)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'media':
        return (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Media Content</h3>
            <p className="mb-2">Media Type: {content.mediaType}</p>
            <p>Media URL: {content.mediaUrl}</p>
            {content.mediaType === 'video' && (
              <div className="mt-4 aspect-video bg-gray-200 flex items-center justify-center">
                <p>Video would be displayed here</p>
              </div>
            )}
            {content.mediaType === 'audio' && (
              <div className="mt-4 p-4 bg-gray-200 rounded flex items-center justify-center">
                <p>Audio player would be displayed here</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>Unknown content type</p>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{content.title}</h1>
        <div className="space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/edit/${content.id}`)}
          >
            Edit Content
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-600 mb-2">{content.description}</p>
            <p className="text-sm text-gray-500">Created: {new Date(content.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            {content.contentType === 'text' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Text</span>}
            {content.contentType === 'quiz' && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Quiz</span>}
            {content.contentType === 'media' && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Media</span>}
          </div>
        </div>
      </div>
      
      {renderContentBasedOnType()}
    </div>
  );
};

export default ViewContent;
