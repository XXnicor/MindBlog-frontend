// Tipos exatos baseados na resposta do backend
export interface Autor {
  id: number;
  nome: string;
  email: string;
  avatar: string | null;
  bio: string | null;
}

export interface Article {
  id: number;
  titulo: string;
  title?: string; // alternativo
  conteudo: string;
  resumo?: string | null;
  summary?: string | null; // alternativo
  categoria?: string | null;
  category?: string | null; // alternativo
  tags?: string[] | null;
  imagem_banner_url: string | null;
  imagem?: string | null; // alternativo
  image?: string | null; // alternativo
  highlight?: boolean;
  destaque?: boolean; // alternativo
  views: number;
  visualizacoes?: number; // alternativo
  likes: number;
  curtidas?: number; // alternativo
  data_publicacao: string;
  data_alteracao?: string | null;
  createdAt?: string; // alternativo
  date?: string; // alternativo
  criadoEm?: string; // alternativo
  autor: Autor;
  author?: Autor | string; // alternativo
  authorId?: string; // alternativo
  authorName?: string; // alternativo
  readTime?: string; // alternativo
  tempoLeitura?: string; // alternativo
  comentarios?: Comment[]; // comentários do artigo
}

// Para listas paginadas
export interface ArticleListResponse {
  data: Article[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Para my-articles
export interface MyArticlesResponse {
  articles: Article[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Comment {
  id: number;
  text: string;
  autor: {
    id: number;
    nome: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface User {
  id: number | string;
  nome: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface Stats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination?: PaginationData;
}