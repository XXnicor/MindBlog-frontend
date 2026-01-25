// 1. URL base da sua API backend - ATUALIZADO
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 2. Função para pegar o token de autenticação salvo
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// 3. Função auxiliar para fazer requisições
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  // Não adicionar Content-Type para FormData (o browser define automaticamente)
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    (config.headers as any)['Content-Type'] = 'application/json';
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Log para debug
  console.log(`[API] ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`, {
    status: response.status,
    ok: response.ok
  });
  
  // Verificar se a resposta é JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    console.error('[API] Resposta não-JSON:', textResponse.substring(0, 200));
    throw new Error(`Erro ${response.status}: Servidor retornou HTML ao invés de JSON. Verifique as rotas do backend.`);
  }

  const result = await response.json();

  if (!response.ok) {
    console.error('[API] Erro:', result);
    throw new Error(result.message || result.error || `Erro ${response.status}: ${response.statusText}`);
  }

  return result.data || result;
};

// Função para mapear artigos do backend para o formato do frontend
const mapArticle = (article: any) => ({
  id: article._id || article.id,
  title: article.titulo || article.title,
  summary: article.resumo || article.summary || '',
  category: article.categoria || article.category,
  author: article.autor?.nome || article.author?.nome || article.author || 'Autor Desconhecido',
  readTime: article.tempoLeitura || article.readTime || '5min',
  views: article.visualizacoes || article.views || 0,
  image: article.imagem || article.image,
  date: article.criadoEm || article.createdAt || article.date,
  highlight: article.destaque || article.highlight || false
});

// 4. Serviço de Artigos
export const articleService = {
  // Listar com paginação e filtros
  async getAll(page = 1, limit = 10, filters: { categoria?: string; search?: string } = {}) {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString(),
      ...(filters.categoria && { categoria: filters.categoria }),
      ...(filters.search && { search: filters.search })
    });
    const response = await apiRequest(`/articles?${params}`);
    
    // Mapear artigos se houver
    if (response.articles && Array.isArray(response.articles)) {
      response.articles = response.articles.map(mapArticle);
    }
    
    return response;
  },

  // Buscar artigo por ID
  async getById(id: string) {
    const article = await apiRequest(`/articles/${id}`);
    return mapArticle(article);
  },

  // Criar artigo
  async create(formData: FormData) {
    return apiRequest('/articles', {
      method: 'POST',
      body: formData
    });
  },

  // Atualizar artigo
  async update(id: string, formData: FormData) {
    return apiRequest(`/articles/${id}`, {
      method: 'PUT',
      body: formData
    });
  },

  // Deletar artigo
  async delete(id: string) {
    return apiRequest(`/articles/${id}`, {
      method: 'DELETE'
    });
  },

  // Buscar comentários de um artigo
  async getComments(articleId: string) {
    return apiRequest(`/articles/${articleId}/comments`);
  },

  // Criar comentário
  async createComment(articleId: string, text: string) {
    return apiRequest(`/articles/${articleId}/comments`, {
      method: 'POST',
      body: { text }
    });
  }
};

// 5. Serviço de Autenticação
export const authService = {
  // Registro de usuário
  async register(data: { nome: string; email: string; senha: string }) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: data
    });
  },

  // Login de usuário
  async login(credentials: { email: string; senha: string }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  // Buscar dados do usuário atual
  async getCurrentUser() {
    return apiRequest('/auth/me');
  }
};

// 6. Serviço de Usuários
export const userService = {
  // Atualizar perfil do usuário
  async updateProfile(formData: FormData) {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: formData
    });
  },

  // Buscar estatísticas do usuário
  async getStats() {
    return apiRequest('/users/stats');
  }
};

// 7. Serviço de Comentários
export const commentService = {
  // Deletar comentário (apenas autor ou admin)
  async delete(commentId: string) {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }
};

// 8. API legado (mantido para compatibilidade)
export const api = {
  // GET - Buscar dados
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

  // POST - Criar/Enviar dados
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

  // PUT - Atualizar dados
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

  // DELETE - Remover dados
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

// 9. Funções auxiliares para gerenciar autenticação
export const auth = {
  // Salvar token após login
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Remover token ao fazer logout
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Verificar se usuário está logado
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};