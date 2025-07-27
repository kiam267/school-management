import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: string;
  date?: string;
  category?: string;
  excerpt?: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNews(data);
    } catch (error) {
      toast &&
        toast({
          title: 'Error',
          description: 'Failed to load news',
          variant: 'destructive',
        });
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single news article by id
  const getNewsById = async (id: number | string) => {
    try {
      const res = await fetch(`/api/news?id=${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  };

  const fetchNewsById = async (id: string) => {
    setLoading(true);
    try {
      const url = `/api/news/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();

      // if fetching a single news item, wrap it in an array
      setNews(id ? [data] : data);
    } catch (error) {
      toast &&
        toast({
          title: 'Error',
          description: 'Failed to load news',
          variant: 'destructive',
        });
    } finally {
      setLoading(false);
    }
  };

  const addNews = async (
    article: Omit<
      NewsArticle,
      'id' | 'createdAt' | 'updatedAt'
    >
  ) => {
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(
          result.error || 'Failed to add news'
        );
      await fetchNews();
      toast &&
        toast({
          title: 'Success',
          description: 'News article added',
        });
      return true;
    } catch (error: any) {
      toast &&
        toast({
          title: 'Error',
          description:
            error.message || 'Failed to add news',
          variant: 'destructive',
        });
      return false;
    }
  };

  const updateNews = async (article: NewsArticle) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(
          result.error || 'Failed to update news'
        );
      await fetchNews();
      toast &&
        toast({
          title: 'Success',
          description: 'News article updated',
        });
      return true;
    } catch (error: any) {
      toast &&
        toast({
          title: 'Error',
          description:
            error.message || 'Failed to update news',
          variant: 'destructive',
        });
      return false;
    }
  };

  const deleteNews = async (id: number) => {
    try {
      const res = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(
          result.error || 'Failed to delete news'
        );
      await fetchNews();
      toast &&
        toast({
          title: 'Success',
          description: 'News article deleted',
        });
      return true;
    } catch (error: any) {
      toast &&
        toast({
          title: 'Error',
          description:
            error.message || 'Failed to delete news',
          variant: 'destructive',
        });
      return false;
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    fetchNews,
    addNews,
    updateNews,
    deleteNews,
    getNewsById,
  };
}
