import { useState, useEffect, useCallback } from 'react';
import { articleService } from '../lib/api';
import { Article, PaginationData } from '../types/article';

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination: PaginationData | null;
  refetch: () => void;
}

export function useArticles(page = 1, limit = 10, filters: { categoria?: string; search?: string } = {}): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await articleService.getAll(page, limit, filters);
      setArticles(response.articles || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error('Erro ao carregar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    loading,
    error,
    pagination,
    refetch: loadArticles
  };
}