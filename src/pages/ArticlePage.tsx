import { useState } from 'react';
import { ArrowLeft, Heart, Bookmark, Share2, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock Data - Múltiplos artigos
const MOCK_ARTICLES_DATA: Record<string, any> = {
  '1': {
    id: '1',
    category: 'Desenvolvimento web',
    title: 'Introdução ao React 19: Novidades e Recursos',
    subtitle: 'Explore as novidades do React 19, incluindo Server Components, Actions e melhorias de performance',
    author: {
      name: 'Ana Silva',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Desenvolvedora Frontend'
    },
    date: '20 jan 2025',
    readTime: '8 min',
    views: 1250,
    likes: 89,
    commentsCount: 12,
    image: 'https://placehold.co/1200x600/1e293b/cyan?text=React+19',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    content: [
      {
        type: 'paragraph',
        text: 'O React 19 chegou com mudanças significativas que prometem revolucionar a forma como desenvolvemos aplicações web. Neste artigo, vamos explorar as principais novidades e como elas podem melhorar seus projetos.'
      },
      {
        type: 'heading',
        text: 'Server Components'
      },
      {
        type: 'paragraph',
        text: 'Uma das maiores adições ao React 19 são os Server Components, que permitem renderizar componentes no servidor, reduzindo o tamanho do bundle JavaScript enviado ao cliente e melhorando significativamente a performance inicial da aplicação.'
      },
      {
        type: 'paragraph',
        text: 'Com Server Components, você pode buscar dados diretamente no servidor, sem a necessidade de fazer requisições adicionais no cliente. Isso resulta em uma experiência mais rápida para o usuário final.'
      },
      {
        type: 'heading',
        text: 'Actions e Melhorias de Performance'
      },
      {
        type: 'paragraph',
        text: 'As Actions no React 19 simplificam o gerenciamento de estado de formulários e operações assíncronas. Você pode agora manipular submissões de formulários de forma mais declarativa e com melhor feedback de loading.'
      },
      {
        type: 'paragraph',
        text: 'Além disso, melhorias no compilador do React resultam em código mais otimizado e menor uso de memória, tornando suas aplicações mais eficientes.'
      }
    ]
  },
  '2': {
    id: '2',
    category: 'DevOps',
    title: 'DevOps: Do Zero ao Deploy Automatizado',
    subtitle: 'Aprenda a configurar pipelines de CI/CD com GitHub Actions, Docker e Kubernetes',
    author: {
      name: 'Carlos Santos',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'DevOps Engineer'
    },
    date: '18 jan 2025',
    readTime: '12 min',
    views: 890,
    likes: 67,
    commentsCount: 8,
    image: 'https://placehold.co/1200x600/1e293b/pink?text=DevOps',
    tags: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Automation'],
    content: [
      {
        type: 'paragraph',
        text: 'DevOps não é apenas uma metodologia, é uma cultura que une desenvolvimento e operações para entregar software de qualidade de forma contínua e eficiente.'
      },
      {
        type: 'heading',
        text: 'O Que é CI/CD?'
      },
      {
        type: 'paragraph',
        text: 'CI/CD (Continuous Integration/Continuous Deployment) é a prática de automatizar a integração de código e o deploy de aplicações. Com pipelines bem configurados, cada commit pode ser automaticamente testado, validado e deployado em produção.'
      },
      {
        type: 'heading',
        text: 'Containerização com Docker'
      },
      {
        type: 'paragraph',
        text: 'Docker revolucionou a forma como empacotamos e distribuímos aplicações. Com containers, você garante que sua aplicação roda da mesma forma em desenvolvimento, teste e produção.'
      }
    ]
  },
  '3': {
    id: '3',
    category: 'AI',
    title: 'Machine Learning com Python: Primeiros Passos',
    subtitle: 'Descubra como começar sua jornada em ML utilizando Python e bibliotecas essenciais',
    author: {
      name: 'Maria Oliveira',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Data Scientist'
    },
    date: '15 jan 2025',
    readTime: '15 min',
    views: 2100,
    likes: 145,
    commentsCount: 23,
    image: 'https://placehold.co/1200x600/1e293b/orange?text=Machine+Learning',
    tags: ['Machine Learning', 'Python', 'AI', 'Data Science'],
    content: [
      {
        type: 'paragraph',
        text: 'Machine Learning está transformando indústrias inteiras, desde saúde até finanças. Python, com seu ecossistema rico de bibliotecas, é a linguagem perfeita para começar.'
      },
      {
        type: 'heading',
        text: 'Bibliotecas Essenciais'
      },
      {
        type: 'paragraph',
        text: 'Pandas, NumPy e scikit-learn formam a base de qualquer projeto de ML em Python. Pandas para manipulação de dados, NumPy para computação numérica e scikit-learn para algoritmos de ML.'
      }
    ]
  },
  '4': {
    id: '4',
    category: 'Desenvolvimento web',
    title: 'TypeScript Avançado: Generics e Utility Types',
    subtitle: 'Domine recursos avançados do TypeScript para criar código mais seguro e reutilizável',
    author: {
      name: 'Pedro Ferreira',
      avatar: 'https://i.pravatar.cc/150?img=33',
      bio: 'TypeScript Expert'
    },
    date: '12 jan 2025',
    readTime: '10 min',
    views: 1580,
    likes: 92,
    commentsCount: 15,
    image: 'https://placehold.co/1200x600/1e293b/blue?text=TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Dev'],
    content: [
      {
        type: 'paragraph',
        text: 'TypeScript eleva o JavaScript a outro nível com seu sistema de tipos robusto. Neste artigo, exploramos Generics e Utility Types.'
      },
      {
        type: 'heading',
        text: 'Entendendo Generics'
      },
      {
        type: 'paragraph',
        text: 'Generics permitem criar componentes reutilizáveis que funcionam com múltiplos tipos, mantendo a segurança de tipos.'
      }
    ]
  },
  '5': {
    id: '5',
    category: 'DevOps',
    title: 'Kubernetes na Prática: Escalando Aplicações',
    subtitle: 'Aprenda a orquestrar containers com Kubernetes de forma profissional',
    author: {
      name: 'João Costa',
      avatar: 'https://i.pravatar.cc/150?img=15',
      bio: 'Cloud Architect'
    },
    date: '10 jan 2025',
    readTime: '18 min',
    views: 1720,
    likes: 110,
    commentsCount: 19,
    image: 'https://placehold.co/1200x600/1e293b/purple?text=Kubernetes',
    tags: ['Kubernetes', 'DevOps', 'Containers', 'Cloud'],
    content: [
      {
        type: 'paragraph',
        text: 'Kubernetes se tornou o padrão para orquestração de containers. Aprenda a escalar suas aplicações de forma eficiente.'
      }
    ]
  },
  '6': {
    id: '6',
    category: 'AI',
    title: 'ChatGPT e APIs: Integrando IA nos Seus Projetos',
    subtitle: 'Veja como integrar a API do OpenAI em suas aplicações',
    author: {
      name: 'Beatriz Lima',
      avatar: 'https://i.pravatar.cc/150?img=20',
      bio: 'AI Developer'
    },
    date: '8 jan 2025',
    readTime: '14 min',
    views: 3200,
    likes: 200,
    commentsCount: 31,
    image: 'https://placehold.co/1200x600/1e293b/green?text=ChatGPT+API',
    tags: ['ChatGPT', 'OpenAI', 'AI', 'APIs'],
    content: [
      {
        type: 'paragraph',
        text: 'A API do ChatGPT abre possibilidades infinitas para criar aplicações inteligentes. Veja como começar.'
      }
    ]
  },
  '7': {
    id: '7',
    category: 'Desenvolvimento web',
    title: 'Clean Code: Princípios para Código Sustentável',
    subtitle: 'Descubra os princípios fundamentais do Clean Code',
    author: {
      name: 'Rafael Souza',
      avatar: 'https://i.pravatar.cc/150?img=8',
      bio: 'Software Engineer'
    },
    date: '5 jan 2025',
    readTime: '9 min',
    views: 1950,
    likes: 88,
    commentsCount: 14,
    image: 'https://placehold.co/1200x600/1e293b/yellow?text=Clean+Code',
    tags: ['Clean Code', 'Best Practices', 'Programming'],
    content: [
      {
        type: 'paragraph',
        text: 'Código limpo não é um luxo, é uma necessidade. Aprenda os princípios que tornam código legível e manutenível.'
      }
    ]
  },
  '8': {
    id: '8',
    category: 'DevOps',
    title: 'Docker Compose: Orquestrando Múltiplos Containers',
    subtitle: 'Aprenda a usar Docker Compose para gerenciar aplicações multi-container',
    author: {
      name: 'Luciana Mendes',
      avatar: 'https://i.pravatar.cc/150?img=25',
      bio: 'DevOps Specialist'
    },
    date: '3 jan 2025',
    readTime: '11 min',
    views: 1340,
    likes: 75,
    commentsCount: 10,
    image: 'https://placehold.co/1200x600/1e293b/red?text=Docker+Compose',
    tags: ['Docker', 'Docker Compose', 'Containers', 'DevOps'],
    content: [
      {
        type: 'paragraph',
        text: 'Docker Compose simplifica o gerenciamento de aplicações com múltiplos containers. Veja como usar.'
      }
    ]
  }
};

const MOCK_COMMENTS = [
  {
    id: '1',
    author: {
      name: 'Ana Paula Silva',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    date: '21 jan 2025',
    text: 'Excelente artigo! Muito bem explicado e com exemplos práticos. Já estou aplicando no meu projeto.',
    likes: 15
  },
  {
    id: '2',
    author: {
      name: 'Carlos Eduardo',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    date: '21 jan 2025',
    text: 'Concordo com os pontos levantados. Muito útil para quem está começando!',
    likes: 8
  },
  {
    id: '3',
    author: {
      name: 'Maria Costa',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    date: '22 jan 2025',
    text: 'Tutorial muito bem estruturado. Consegui aplicar os conceitos no meu projeto.',
    likes: 12
  }
];

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Busca o artigo pelo ID ou usa o primeiro como fallback
  const ARTICLE_DATA = MOCK_ARTICLES_DATA[id || '1'] || MOCK_ARTICLES_DATA['1'];
  const [likesCount, setLikesCount] = useState(ARTICLE_DATA.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Link
          to="/artigos"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Voltar aos Artigos</span>
        </Link>

        {/* Cabeçalho do Artigo */}
        <header className="mb-8">
          {/* Badge de Categoria */}
          <div className="mb-4">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {ARTICLE_DATA.category}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {ARTICLE_DATA.title}
          </h1>

          {/* Subtítulo */}
          <p className="text-lg text-slate-400 mb-6">
            {ARTICLE_DATA.subtitle}
          </p>

          {/* Metadados */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            {/* Autor */}
            <div className="flex items-center gap-3">
              <img
                src={ARTICLE_DATA.author.avatar}
                alt={ARTICLE_DATA.author.name}
                className="w-12 h-12 rounded-full border-2 border-slate-700"
              />
              <div>
                <div className="text-white font-medium">{ARTICLE_DATA.author.name}</div>
                <div className="text-sm text-slate-400">
                  {ARTICLE_DATA.date} • {ARTICLE_DATA.readTime} de leitura
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked
                    ? 'bg-red-500/20 text-red-500'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Curtir"
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-cyan-500/20 text-cyan-500'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Salvar"
              >
                <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Compartilhar"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>{likesCount} curtidas</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{ARTICLE_DATA.views} visualizações</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>{ARTICLE_DATA.commentsCount} comentários</span>
            </div>
          </div>
        </header>

        {/* Banner Principal */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={ARTICLE_DATA.image}
            alt={ARTICLE_DATA.title}
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Corpo do Texto */}
        <article className="prose prose-invert prose-slate max-w-none mb-12">
          <div className="space-y-6">
            {ARTICLE_DATA.content.map((block: any, index: number) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                    {block.text}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-slate-300 leading-relaxed text-lg">
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {ARTICLE_DATA.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Seção de Comentários */}
        <section className="mt-16 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Comentários ({MOCK_COMMENTS.length})
          </h2>

          {/* Caixa de Login para Comentar */}
          <div className="mb-8 bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <p className="text-slate-400 mb-4">Faça login para participar da discussão</p>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-colors">
              Fazer Login
            </button>
          </div>

          {/* Lista de Comentários */}
          <div className="space-y-6">
            {MOCK_COMMENTS.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-white font-medium">{comment.author.name}</div>
                      <div className="text-sm text-slate-500">{comment.date}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-500 transition-colors">
                    <ThumbsUp size={16} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
