import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetContentByIdQuery, useUpdateContentMutation, useGetCategoriesQuery } from '../store/api';
import { Content, TextContent, QuizContent, MediaContent, QuizQuestion } from '../types/content';
import Button from '../components/Button';
import Modal from '../components/Modal';


const EditContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: content, isLoading: isContentLoading } = useGetContentByIdQuery(id || '');
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [textContent, setTextContent] = useState('');
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setDescription(content.description);
      setCategoryId(content.categoryId);
      
      if (content.contentType === 'text') {
        setTextContent((content as TextContent).content);
      } else if (content.contentType === 'media') {
        setMediaType((content as MediaContent).mediaType);
        setMediaUrl((content as MediaContent).mediaUrl);
      } else if (content.contentType === 'quiz') {
        setQuestions((content as QuizContent).questions);
      }
    }
  }, [content]);

  if (isContentLoading || isCategoriesLoading) {
    return <div className="container mx-auto px-4 py-8">Loading content...</div>;
  }

  if (!content) {
    return <div className="container mx-auto px-4 py-8">Content not found</div>;
  }

  const handleUpdateQuizQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleUpdateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleSetCorrectAnswer = (questionIndex: number, optionId: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionId = optionId;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let updatedContent: Partial<Content> = {
        ...content,
        title,
        description,
        categoryId
      };
      
      if (content.contentType === 'text') {
        (updatedContent as TextContent).content = textContent;
      } else if (content.contentType === 'media') {
        (updatedContent as MediaContent).mediaType = mediaType;
        (updatedContent as MediaContent).mediaUrl = mediaUrl;
      } else if (content.contentType === 'quiz') {
        (updatedContent as QuizContent).questions = questions;
      }
      
      await updateContent(updatedContent as Content).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to update content:', err);
      setErrorMessage('Failed to update content. Please try again.');
      setIsErrorModalOpen(true);
    }
  };

  const renderContentTypeFields = () => {
    switch (content.contentType) {
      case 'text':
        return (
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 mb-2">Content</label>
            <textarea
              id="content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your content here"
              rows={10}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        );
        
      case 'media':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Media Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                    className="mr-2"
                  />
                  Video
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="audio"
                    checked={mediaType === 'audio'}
                    onChange={() => setMediaType('audio')}
                    className="mr-2"
                  />
                  Audio
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="mediaUrl" className="block text-gray-700 mb-2">Media URL</label>
              <input
                id="mediaUrl"
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Enter media URL"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );
        
      case 'quiz':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Quiz Questions</h2>
            {questions.map((question, qIndex) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Question {qIndex + 1}</label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleUpdateQuizQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter question"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Options</label>
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={option.id === question.correctOptionId}
                        onChange={() => handleSetCorrectAnswer(qIndex, option.id)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleUpdateQuizOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 rounded-md border border-gray-300 p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)} Content</h1>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="" disabled>Select category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {renderContentTypeFields()}
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : 'Update Content'}
          </Button>
        </div>
      </form>

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
    </div>
  );
};

export default EditContent;
