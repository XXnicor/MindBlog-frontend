const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função genérica para requisições
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    (config.headers as any)['Content-Type'] = 'application/json';
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
  
  // Verificar se a resposta é JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    throw new Error(`Erro ${response.status}: Servidor retornou HTML ao invés de JSON. Verifique as rotas do backend.`);
  }

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    throw new Error(result.message || result.error || `Erro ${response.status}: ${response.statusText}`);
  }

  return result.data || result;
}

// Tipos
import { Article, ArticleListResponse, MyArticlesResponse, User, Stats, Comment, ArticlesResponse } from '../types/article';

export const articleService = {
  async getAll(page = 1, limit = 10, filters: { categoria?: string; search?: string } = {}) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString(),
      ...(filters.categoria && { categoria: filters.categoria }),
      ...(filters.search && { search: filters.search })
    });
    
    const response = await apiRequest<ArticlesResponse>(`/articles?${params}`);
    
    // Retornar artigos como estão (já devem estar no formato correto)
    return {
      articles: response.articles || [],
      pagination: response.pagination
    };
  },

  async getById(id: string | number): Promise<Article> {
    const article = await apiRequest<Article>(`/articles/${id}`);
    return article;
  },

  async create(formData: FormData): Promise<Article> {
    const response = await apiRequest<Article>('/articles', {
      method: 'POST',
      body: formData
    });
    return response;
  },

  async update(id: string | number, formData: FormData): Promise<Article> {
    return apiRequest<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: formData
    });
  },

  async delete(id: string | number): Promise<void> {
    return apiRequest<void>(`/articles/${id}`, {
      method: 'DELETE'
    });
  },

  async getComments(articleId: string | number) {
    return apiRequest<Comment[]>(`/articles/${articleId}/comments`);
  },

  async createComment(articleId: string | number, text: string): Promise<Comment> {
    return apiRequest<Comment>(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  async getMyArticles(page = 1, limit = 10) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString(),
      myArticles: 'true'
    });
    
    try {
      const response = await apiRequest<MyArticlesResponse>(`/users/my-articles?${params}`);
      return {
        articles: response.articles || [],
        pagination: response.pagination
      };
    } catch (error: any) {
      // Fallback: buscar artigos filtrados por autor
      const currentUser = await authService.getCurrentUser();
      const params2 = new URLSearchParams({ 
        page: page.toString(), 
        limit: limit.toString(),
        autor: currentUser.id.toString()
      });
      
      const response = await apiRequest<ArticlesResponse>(`/articles?${params2}`);
      return {
        articles: response.articles || [],
        pagination: response.pagination
      };
    }
  }
};

export const authService = {
  async register(data: { nome: string; email: string; senha: string }) {
    return apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  async login(credentials: { email: string; senha: string }) {
    return apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me');
  }
};

export const userService = {
  async updateProfile(formData: FormData): Promise<User> {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: formData
    });
  },

  async getStats(): Promise<Stats> {
    return apiRequest<Stats>('/users/stats');
  }
};

export const commentService = {
  async delete(commentId: string | number): Promise<void> {
    return apiRequest<void>(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }
};

// API genérica (mantida para compatibilidade)
export const api = {
  get: async <T>(path: string, includeAuth = true): Promise<{ data: T }> => {
    try {
      const token = includeAuth ? getAuthToken() : null;
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api${path}`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return { data: data.data || data };
    } catch (err) {
      throw err;
    }
  },

  post: async <T>(path: string, body: any, options?: { headers?: HeadersInit }): Promise<{ data: T }> => {
    try {
      const isFormData = body instanceof FormData;
      const token = getAuthToken();
      const headers: any = isFormData 
        ? { ...(token && { 'Authorization': `Bearer ${token}` }) }
        : { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options?.headers 
          };

      const res = await fetch(`${API_BASE_URL}/api${path}`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return { data: data.data || data };
    } catch (err) {
      throw err;
    }
  },

  put: async <T>(path: string, body: any, options?: { headers?: HeadersInit }): Promise<{ data: T }> => {
    try {
      const isFormData = body instanceof FormData;
      const token = getAuthToken();
      const headers: any = isFormData 
        ? { ...(token && { 'Authorization': `Bearer ${token}` }) }
        : { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options?.headers 
          };

      const res = await fetch(`${API_BASE_URL}/api${path}`, {
        method: 'PUT',
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return { data: data.data || data };
    } catch (err) {
      throw err;
    }
  },

  delete: async <T>(path: string): Promise<{ data: T }> => {
    try {
      const token = getAuthToken();
      const headers: any = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const res = await fetch(`${API_BASE_URL}/api${path}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro na requisição' }));
        throw new Error(error.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return { data: data.data || data };
    } catch (err) {
      throw err;
    }
  },
};

export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};