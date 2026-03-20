export interface Author {
  _id?: string;
  id?: number | string;
  nome?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  email?: string;
}

export interface Article {
  id: string;
  _id?: string;
  title: string;
  titulo?: string;
  summary: string;
  resumo?: string;
  category: string;
  categoria?: string;
  autor?: Author;
  author?: Author | string;
  authorId?: string;
  authorName?: string;
  readTime: string;
  tempoLeitura?: string;
  views: number;
  visualizacoes?: number;
  image?: string;
  imagem?: string;
  imagem_banner_url?: string;
  highlight?: boolean;
  destaque?: boolean;
  date?: string;
  criadoEm?: string;
  createdAt?: string;
  curtidas?: number;
  likes?: number;
  tags?: string[];
  conteudo?: string;
  comentarios?: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  autor?: {
    id: number;
    nome: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  nome?: string;
  email: string;
  avatar?: string;
  bio?: string;
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
