import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Bookmark, Share2, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import { articleService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';
import { Article } from '../types/article';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await articleService.getById(articleId) as Article;
      setArticle(data);
      setLikesCount(data.curtidas || data.likes || 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando artigo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || 'Artigo não encontrado'}</p>
            <Link
              to="/artigos"
              className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400"
            >
              <ArrowLeft size={20} />
              Voltar aos artigos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = article.imagem_banner_url || getImageUrl(article.imagem || article.image);

  // Formatar data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const contentParagraphs = article.conteudo?.split('\n\n').filter((p: string) => p.trim()) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/artigos"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Voltar aos Artigos</span>
        </Link>

        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {article.categoria || article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {article.titulo || article.title}
          </h1>

          {(article.resumo || article.summary) && (
            <p className="text-lg text-slate-400 mb-6">
              {article.resumo || article.summary}
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {(
                  article.autor?.nome ||
                  (typeof article.author === 'object' && article.author?.nome) ||
                  (typeof article.author === 'string' ? article.author : '') ||
                  'A'
                )?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <div className="text-white font-medium">
                  {article.autor?.nome || (typeof article.author === 'object' ? article.author?.nome : '') || (typeof article.author === 'string' ? article.author : 'Autor')}
                </div>
                <div className="text-sm text-slate-400">
                  {formatDate(article.criadoEm || article.createdAt || article.date)} • {article.tempoLeitura || article.readTime || '5min'} de leitura
                </div>
              </div>
            </div>

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

          <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Heart size={16} />
              <span>{likesCount} curtidas</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{article.visualizacoes || article.views || 0} visualizações</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>{article.comentarios?.length || 0} comentários</span>
            </div>
          </div>
        </header>

        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={article.titulo || article.title}
              className="w-full aspect-video object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Corpo do Texto */}
        <article className="prose prose-invert prose-slate max-w-none mb-12">
          <div className="space-y-6">
            {contentParagraphs.map((paragraph: string, index: number) => {
              // Detectar se é um título (começa com # ou é curto e em maiúsculas)
              if (paragraph.startsWith('#')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                    {paragraph.replace(/^#+\s*/, '')}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Seção de Comentários */}
        <section className="mt-16">
          <CommentSection articleId={id || ''} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
