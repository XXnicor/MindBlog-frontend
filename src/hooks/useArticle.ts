import { useState, useEffect, useCallback } from 'react';
import { articleService } from '../lib/api';
import { Article } from '../types/article';

interface UseArticleResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArticle(id: string | number | undefined): UseArticleResult {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await articleService.getById(id);
      setArticle(data);
    } catch (err: any) {
      console.error('Erro ao carregar artigo:', err);
      setError(err.message || 'Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  return {
    article,
    loading,
    error,
    refetch: loadArticle
  };
}