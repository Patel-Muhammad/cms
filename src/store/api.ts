
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Content, Category } from '../types/content';
import mockData from '../data/mockData.json';

const initializeLocalStorage = () => {
  if (!localStorage.getItem('cmsContent')) {
    localStorage.setItem('cmsContent', JSON.stringify(mockData.content));
  }
  if (!localStorage.getItem('cmsCategories')) {
    localStorage.setItem('cmsCategories', JSON.stringify(mockData.categories));
  }
};

initializeLocalStorage();

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Content', 'Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: () => {
        const categories = JSON.parse(localStorage.getItem('cmsCategories') || '[]');
        return { data: categories as Category[] };
      },
      providesTags: ['Category'],
    }),
    
    getAllContent: builder.query<Content[], void>({
      queryFn: () => {
        const content = JSON.parse(localStorage.getItem('cmsContent') || '[]');
        return { data: content as Content[] };
      },
      providesTags: ['Content'],
    }),
    
    getContentById: builder.query<Content | undefined, string>({
      queryFn: (id) => {
        const content = JSON.parse(localStorage.getItem('cmsContent') || '[]');
        const foundContent = content.find((item: Content) => item.id === id);
        return { data: foundContent };
      },
      providesTags: (id) => [{ type: 'Content', id }],
    }),
    
    addContent: builder.mutation<Content, Omit<Content, 'id' | 'createdAt'>>({
      queryFn: (newContent) => {
        try {
          const content = {
            ...newContent,
            id: `${newContent.contentType}${Date.now()}`,
            createdAt: new Date().toISOString(),
          } as Content;
          
          const existingContent = JSON.parse(localStorage.getItem('cmsContent') || '[]');
          
          const updatedContent = [...existingContent, content];
          
          localStorage.setItem('cmsContent', JSON.stringify(updatedContent));
          
          return { data: content };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Content'],
    }),
    
    updateContent: builder.mutation<Content, Content>({
      queryFn: (updatedContent) => {
        try {
          const existingContent = JSON.parse(localStorage.getItem('cmsContent') || '[]');
          
          const contentIndex = existingContent.findIndex((item: Content) => item.id === updatedContent.id);
          
          if (contentIndex === -1) {
            return { error: { status: 'CUSTOM_ERROR', error: 'Content not found' } };
          }
          
          const newContent = [...existingContent];
          newContent[contentIndex] = updatedContent;
          
          localStorage.setItem('cmsContent', JSON.stringify(newContent));
          
          return { data: updatedContent };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Content'],
    }),
    
    deleteContent: builder.mutation<{ success: boolean; id: string }, string>({
      queryFn: (id) => {
        try {
          const existingContent = JSON.parse(localStorage.getItem('cmsContent') || '[]');
          
          const updatedContent = existingContent.filter((item: Content) => item.id !== id);
          
          localStorage.setItem('cmsContent', JSON.stringify(updatedContent));
          
          return { data: { success: true, id } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Content'],
    }),
  }),
});

export const { 
  useGetCategoriesQuery, 
  useGetAllContentQuery,
  useAddContentMutation,
  useGetContentByIdQuery,
  useUpdateContentMutation,
  useDeleteContentMutation
} = api;
