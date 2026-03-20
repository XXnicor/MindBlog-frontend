import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Share2, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import { useArticle } from '../hooks/useArticle';
import { getImageUrl } from '../lib/imageUtils';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticle(id);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  // Atualizar contagens e progresso de scroll
  useEffect(() => {
    if (article) {
      setLikesCount(article.curtidas || article.likes || 0);
    }
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      // Cálculo do progresso de leitura
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollTop / docHeight) * 100);
      }
      
      // Mostrar sidebar após passar do hero (aprox 400px)
      setShowSidebar(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="text-ink-muted font-body">Carregando edição...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Navbar />
        <div className="max-w-[680px] mx-auto px-6 py-32 text-center">
          <p className="text-red-500 font-medium mb-6">{error || 'Artigo não encontrado'}</p>
          <Link to="/artigos" className="inline-flex items-center gap-2 text-ink-light hover:text-ink transition-colors font-medium hover-underline pb-1">
            <ArrowLeft size={18} />
            Voltar aos Artigos
          </Link>
        </div>
      </div>
    );
  }

  const titulo = article.titulo || article.title || 'Sem título';
  const resumo = article.resumo || article.summary || '';
  const categoria = article.categoria || article.category || 'Editorial';
  const conteudo = article.conteudo || '';
  const tags = article.tags || [];
  const views = article.views || article.visualizacoes || 0;
  
  const wordCount = conteudo.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
  const readTime = Math.ceil(wordCount / 200) + " min de leitura";
  
  const dataPublicacao = article.data_publicacao || article.createdAt || article.date || article.criadoEm || new Date().toISOString();
  
  const autorNome = article?.autor?.nome ?? 'Autor Desconhecido';
  
  const imageUrl = article.imagem_banner_url || getImageUrl(article.imagem || article.image);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const contentParagraphs = conteudo.split('\n\n').filter((p: string) => p.trim());

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-accent z-[60] transition-all duration-75 origin-left"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-[480px] mt-14 md:mt-16 bg-paper-alt">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={titulo}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full pattern-dots opacity-50" />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end px-6 md:px-12 pb-12">
          <div className="w-full max-w-[800px] mx-auto flex flex-col items-center text-center">
            
            <span className="inline-block px-3 py-1 bg-white text-ink text-[11px] font-bold uppercase tracking-wider rounded-full mb-6">
              {categoria}
            </span>
            
            <h1 className="font-display font-semibold text-white leading-tight mb-8" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>
              {titulo}
            </h1>
            
            {/* Info do Autor Hero */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-paper-alt flex items-center justify-center text-ink text-[14px] font-bold shadow-md">
                {autorNome?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex flex-col items-start text-white">
                <span className="font-medium text-[14px]">{autorNome}</span>
                <span className="text-[13px] text-white/80">
                  {formatDate(dataPublicacao)} · {readTime}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <main className="relative max-w-[680px] mx-auto px-6 py-16">
        
        {/* Sidebar fixa (Desktop) */}
        <div className={`hidden lg:flex flex-col gap-6 fixed top-[250px] left-[max(24px,calc(50%-440px))] transition-opacity duration-300 ${showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center gap-1 group">
            <button
              onClick={handleLike}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-accent hover:border-accent transition-all duration-base bg-white"
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-accent' : ''} />
            </button>
            <span className="text-[12px] font-medium text-ink-muted group-hover:text-ink transition-colors">{likesCount}</span>
          </div>
          
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-ink transition-all duration-base bg-white"
            title="Salvar artigo"
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleShare}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-ink transition-all duration-base bg-white"
            title="Copiar link"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-ink transition-all duration-base bg-white relative mt-4"
          >
            <MessageCircle size={20} />
            {(article.comentarios?.length || 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-ink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {article.comentarios?.length}
              </span>
            )}
          </button>
        </div>

        {/* Resumo destacado antes do artigo */}
        {resumo && (
          <p className="font-reading text-[22px] text-ink-light leading-relaxed italic mb-12 pb-10 border-b border-border text-center">
            "{resumo}"
          </p>
        )}

        {/* Corpo do Texto */}
        <article className="font-reading text-[18px] text-ink leading-[1.85] mb-20 space-y-6">
          {contentParagraphs.map((paragraph: string, index: number) => {
            // Detect H2
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="font-display font-bold text-[28px] text-ink mt-12 mb-6">
                  {paragraph.replace(/^##\s*/, '')}
                </h2>
              );
            }
            // Detect H3 or single #
            if (paragraph.startsWith('# ')) {
              return (
                <h3 key={index} className="font-display font-semibold text-[22px] text-ink mt-10 mb-4">
                  {paragraph.replace(/^#\s*/, '')}
                </h3>
              );
            }
            // Detect Blockquote
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="border-l-4 border-accent pl-6 py-2 my-10 font-reading italic text-[20px] text-ink-light bg-paper-alt/30 rounded-r-lg">
                  {paragraph.replace(/^>\s*/, '')}
                </blockquote>
              );
            }
            
            // Standard constraints check text length to wrap or just use paragraph
            return (
              <p key={index} className="mb-6 whitespace-pre-wrap">
                {paragraph}
              </p>
            );
          })}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2 items-center">
              <span className="text-[13px] font-bold text-ink-muted uppercase tracking-widest mr-2">Tags</span>
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-paper-alt border border-border text-ink-light text-[13px] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Footer do Autor */}
        <div className="border border-border rounded-2xl p-8 bg-paper-alt flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 mb-16">
          <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-ink text-[22px] font-bold shrink-0">
            {autorNome?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <span className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-1">Escrito por</span>
            <h4 className="font-display text-[22px] font-semibold text-ink mb-2">{autorNome}</h4>
            <p className="font-body text-[14px] text-ink-light leading-relaxed mb-4 max-w-[400px]">
              Editor(a) e colaborador(a) no MindBlog. Escreve sobre ideias que cruzam as fronteiras do design e tecnologia.
            </p>
            <button className="border border-ink text-ink font-medium text-[13px] px-6 py-2 rounded-full hover:bg-ink hover:text-white transition-colors duration-fast">
              Seguir
            </button>
          </div>
        </div>

        {/* Mobile Action Bar (Fixed bottom for mobile only) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-paper/90 backdrop-blur border-t border-border p-3 px-6 flex items-center justify-around z-40">
           <button onClick={handleLike} className="flex flex-col items-center gap-1 text-ink-muted">
             <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'text-accent' : ''} />
             <span className="text-[10px] font-medium">{likesCount}</span>
           </button>
           <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 text-ink-muted">
             <Bookmark size={22} fill={isBookmarked ? 'currentColor' : 'none'} className={isBookmarked ? 'text-ink' : ''} />
             <span className="text-[10px] font-medium">Salvar</span>
           </button>
           <button onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-ink-muted">
             <MessageCircle size={22} />
             <span className="text-[10px] font-medium">{article.comentarios?.length || 0}</span>
           </button>
           <button onClick={handleShare} className="flex flex-col items-center gap-1 text-ink-muted">
             <Share2 size={22} />
             <span className="text-[10px] font-medium">Share</span>
           </button>
        </div>

        {/* Seção de Comentários */}
        <section id="comments" className="mt-16 pt-8 border-t border-border">
          <CommentSection articleId={id || ''} />
        </section>
      </main>

      <Footer />
    </div>
  );
}