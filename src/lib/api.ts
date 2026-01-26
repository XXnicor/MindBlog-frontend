const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Verificar se a resposta é JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    throw new Error(`Erro ${response.status}: Servidor retornou HTML ao invés de JSON. Verifique as rotas do backend.`);
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || `Erro ${response.status}: ${response.statusText}`);
  }

  return result.data || result;
};

const mapArticle = (article: any) => ({
  id: article._id || article.id,
  title: article.titulo || article.title,
  summary: article.resumo || article.summary || '',
  category: article.categoria || article.category,
  author: article.autor?.nome || article.author?.nome || article.author || 'Autor Desconhecido',
  authorId: article.autor?._id || article.autor?.id || article.author?._id || article.author?.id,
  readTime: article.tempoLeitura || article.readTime || '5min',
  views: article.visualizacoes || article.views || 0,
  image: article.imagem || article.image,
  imagem_banner_url: article.imagem_banner_url,
  date: article.criadoEm || article.createdAt || article.date,
  highlight: article.destaque || article.highlight || false
});

export const articleService = {
  async getAll(page = 1, limit = 10, filters: { categoria?: string; search?: string } = {}) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString(),
      ...(filters.categoria && { categoria: filters.categoria }),
      ...(filters.search && { search: filters.search })
    });
    const response = await apiRequest(`/articles?${params}`);
    
    if (response.articles && Array.isArray(response.articles)) {
      response.articles = response.articles.map(mapArticle);
    }
    
    return response;
  },

  async getById(id: string) {
    const article = await apiRequest(`/articles/${id}`);
    return article;
  },

  async create(formData: FormData) {
    const response = await apiRequest('/articles', {
      method: 'POST',
      body: formData
    });
    return response;
  },

  async update(id: string, formData: FormData) {
    return apiRequest(`/articles/${id}`, {
      method: 'PUT',
      body: formData
    });
  },

  async delete(id: string) {
    return apiRequest(`/articles/${id}`, {
      method: 'DELETE'
    });
  },

  async getComments(articleId: string) {
    return apiRequest(`/articles/${articleId}/comments`);
  },

  async createComment(articleId: string, text: string) {
    return apiRequest(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: { text }
    });
  },

  async getMyArticles(page = 1, limit = 10) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString(),
      myArticles: 'true'
    });
    
    try {
      const response = await apiRequest(`/users/my-articles?${params}`);
      
      if (response.articles && Array.isArray(response.articles)) {
        response.articles = response.articles.map(mapArticle);
      }
      
      return response;
    } catch (error: any) {
      const currentUser = await authService.getCurrentUser();
      const params2 = new URLSearchParams({ 
        page: page.toString(), 
        limit: limit.toString(),
        autor: currentUser.id || currentUser._id
      });
      
      const response = await apiRequest(`/articles?${params2}`);
      
      if (response.articles && Array.isArray(response.articles)) {
        response.articles = response.articles.map(mapArticle);
      }
      
      return response;
    }
  }
};

export const authService = {
  async register(data: { nome: string; email: string; senha: string }) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: data
    });
  },

  async login(credentials: { email: string; senha: string }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  async getCurrentUser() {
    return apiRequest('/auth/me');
  }
};

export const userService = {
  async updateProfile(formData: FormData) {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: formData
    });
  },

  async getStats() {
    return apiRequest('/users/stats');
  }
};

export const commentService = {
  async delete(commentId: string) {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }
};

export const api = {
  get: async (path: string, includeAuth = true) => {
    try {
      const token = includeAuth ? getAuthToken() : null;
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}${path}`, {
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
      console.error('API GET Error:', err);
      throw err;
    }
  },

  post: async (path: string, body: any, options?: { headers?: HeadersInit }) => {
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

      const res = await fetch(`${API_BASE_URL}${path}`, {
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
      console.error('API POST Error:', err);
      throw err;
    }
  },

  put: async (path: string, body: any, options?: { headers?: HeadersInit }) => {
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

      const res = await fetch(`${API_BASE_URL}${path}`, {
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
      console.error('API PUT Error:', err);
      throw err;
    }
  },

  delete: async (path: string) => {
    try {
      const token = getAuthToken();
      const headers: any = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const res = await fetch(`${API_BASE_URL}${path}`, {
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
      console.error('API DELETE Error:', err);
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