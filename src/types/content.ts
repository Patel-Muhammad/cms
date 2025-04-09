
export interface Category {
  id: string;
  name: string;
}

export interface BaseContent {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  createdAt: string;
  contentType: 'text' | 'quiz' | 'media';
}

export interface TextContent extends BaseContent {
  contentType: 'text';
  content: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizContent extends BaseContent {
  contentType: 'quiz';
  questions: QuizQuestion[];
}

export interface MediaContent extends BaseContent {
  contentType: 'media';
  mediaType: 'audio' | 'video';
  mediaUrl: string;
}

export type Content = TextContent | QuizContent | MediaContent;
