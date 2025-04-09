
import React, { useState } from 'react';
import { Content } from '../types/content';
import { useNavigate } from 'react-router-dom';
import { useDeleteContentMutation } from '../store/api';
import Modal from './Modal';
import Button from './Button';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate();
  const [deleteContent, { isLoading: isDeleting }] = useDeleteContentMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getContentTypeBadge = () => {
    switch (content.contentType) {
      case 'text':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Text</span>;
      case 'quiz':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Quiz</span>;
      case 'media':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Media</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleView = () => {
    navigate(`/view/${content.id}`);
  };

  const handleEdit = () => {
    navigate(`/edit/${content.id}`);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteContent(content.id).unwrap();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Failed to delete content');
      setIsErrorModalOpen(true);
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-sm transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">{content.title}</h3>
            {getContentTypeBadge()}
          </div>
          <p className="text-gray-600 text-sm mb-2">{content.description}</p>
          <p className="text-gray-500 text-xs">Created: {formatDate(content.createdAt)}</p>
        </div>
        <div className="bg-gray-50 p-3">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 mr-3"
            onClick={handleView}
          >
            View
          </button>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 mr-3"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="text-sm text-red-600 hover:text-red-800"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        actions={
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="secondary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this content?</p>
        <p className="font-semibold mt-2">{content.title}</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Error"
        actions={
          <Button onClick={() => setIsErrorModalOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-red-600">{errorMessage}</p>
      </Modal>
    </>
  );
};

export default ContentCard;
