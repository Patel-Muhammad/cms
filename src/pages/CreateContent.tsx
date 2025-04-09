import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery, useAddContentMutation } from '../store/api';
import TextInput from '../components/TextInput';
import TextArea from '../components/TextArea';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';


type ContentType = 'text' | 'quiz' | 'media';

interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const CreateContent: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories} = useGetCategoriesQuery();
  const [addContent, { isLoading: isSubmitting }] = useAddContentMutation();

  const [contentType, setContentType] = useState<ContentType>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [textContent, setTextContent] = useState('');
  

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q${Date.now()}`,
      question: '',
      options: [
        { id: `opt1-${Date.now()}`, text: '' },
        { id: `opt2-${Date.now()}`, text: '' },
      ],
      correctOptionId: '',
    }
  ]);
  
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video');
  const [mediaUrl, setMediaUrl] = useState('');


  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${Date.now()}`,
        question: '',
        options: [
          { id: `opt1-${Date.now()}`, text: '' },
          { id: `opt2-${Date.now()}`, text: '' },
        ],
        correctOptionId: '',
      }
    ]);
  };

  const handleQuestionChange = (questionId: string, field: string, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleOptionChange = (questionId: string, optionId: string, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.map(opt => 
          opt.id === optionId ? { ...opt, text: value } : opt
        )
      } : q
    ));
  };

  const handleCorrectOptionChange = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, correctOptionId: optionId } : q
    ));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: [...q.options, { id: `opt${q.options.length + 1}-${Date.now()}`, text: '' }]
      } : q
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let contentData;
      
      switch (contentType) {
        case 'text':
          contentData = {
            title,
            description,
            categoryId,
            contentType,
            content: textContent,
          };
          break;
        case 'quiz':
          contentData = {
            title,
            description,
            categoryId,
            contentType,
            questions,
          };
          break;
        case 'media':
          contentData = {
            title,
            description,
            categoryId,
            contentType,
            mediaType,
            mediaUrl,
          };
          break;
      }
      
      await addContent(contentData as any).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to create content:', err);
      setErrorMessage('Failed to create content. Please try again.');
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Create New Content</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setContentType('text')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center transition-colors ${
                  contentType === 'text' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Text</div>
                <div className="text-xs text-gray-500 mt-1">Articles, Pages</div>
              </button>
              <button
                type="button"
                onClick={() => setContentType('quiz')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center transition-colors ${
                  contentType === 'quiz' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Quiz</div>
                <div className="text-xs text-gray-500 mt-1">Multiple Choice</div>
              </button>
              <button
                type="button"
                onClick={() => setContentType('media')}
                className={`py-3 px-4 border rounded-md flex flex-col items-center justify-center transition-colors ${
                  contentType === 'media' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Media</div>
                <div className="text-xs text-gray-500 mt-1">Audio, Video</div>
              </button>
            </div>
          </div>

          <TextInput
            label="Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <TextArea
            label="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <Select
            label="Category"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories?.map(cat => ({ value: cat.id, label: cat.name })) || []}
            required
          />
          
          {contentType === 'text' && (
            <TextArea
              label="Content"
              id="content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={8}
              required
            />
          )}
          
          {contentType === 'quiz' && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-medium mb-4">Quiz Questions</h3>
              
              {questions.map((question, qIndex) => (
                <div key={question.id} className="mb-8 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Question {qIndex + 1}</h4>
                  </div>
                  
                  <TextInput
                    label="Question"
                    id={`question-${question.id}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                    required
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options <span className="text-red-500">*</span>
                    </label>
                    
                    {question.options.map((option, index) => (
                      <div key={option.id} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`option-${option.id}`}
                          name={`correctOption-${question.id}`}
                          checked={question.correctOptionId === option.id}
                          onChange={() => handleCorrectOptionChange(question.id, option.id)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
                          required
                        />
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => handleAddOption(question.id)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  + Add Another Question
                </button>
              </div>
            </div>
          )}
          
          {contentType === 'media' && (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={mediaType === 'video'}
                      onChange={() => setMediaType('video')}
                      className="mr-2"
                    />
                    Video
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={mediaType === 'audio'}
                      onChange={() => setMediaType('audio')}
                      className="mr-2"
                    />
                    Audio
                  </label>
                </div>
              </div>
              
              <TextInput
                label="Media URL"
                id="mediaUrl"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Enter URL or upload file"
                required
              />
              
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      </div>

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

export default CreateContent;
