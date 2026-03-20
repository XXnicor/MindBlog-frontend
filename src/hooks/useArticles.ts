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

  const { categoria, search } = filters;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articleService.getAll(page, limit, { categoria, search });
      setArticles(response.articles || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error('Erro ao recarregar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  }, [page, limit, categoria, search]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      
      try {
        const response = await articleService.getAll(page, limit, { categoria, search });
        if (!cancelled) {
          setArticles(response.articles || []);
          setPagination(response.pagination || null);
        }
      } catch (err: any) {
        console.error('Erro ao carregar artigos:', err);
        if (!cancelled) setError(err.message || 'Erro ao carregar artigos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [page, limit, categoria, search]);

  return {
    articles,
    loading,
    error,
    pagination,
    refetch
  };
}