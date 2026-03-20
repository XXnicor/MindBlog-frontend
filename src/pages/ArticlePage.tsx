import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import { useArticle } from '../hooks/useArticle';
import { useArticles } from '../hooks/useArticles';
import { getImageUrl } from '../lib/imageUtils';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticle(id);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filtros seguros usando useMemo para evitar loop no useArticles
  const relatedFilters = useMemo(() => ({
    categoria: article?.categoria || undefined
  }), [article?.categoria]);
  const { articles: relatedResults } = useArticles(1, 4, relatedFilters);
  const relatedArticles = relatedResults.filter(a => String(a.id) !== id).slice(0, 3);

  // Atualizar contagens
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
      <div className="min-h-screen bg-background text-on-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32 pb-24">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-secondary font-label uppercase tracking-widest text-xs font-bold">Carregando edição...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col">
        <Navbar />
        <div className="max-w-[680px] mx-auto px-6 py-40 text-center flex-1">
          <p className="text-error font-medium mb-6 font-headline text-2xl">{error || 'Artigo não encontrado'}</p>
          <Link to="/artigos" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label font-bold text-sm uppercase tracking-widest pb-1 border-b border-outline-variant/30">
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar aos Artigos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const titulo = article.titulo || article.title || 'Sem título';
  const resumo = article.resumo || article.summary || '';
  const categoria = article.categoria || article.category || 'Editorial';
  const conteudo = article.conteudo || '';
  const tags = article.tags || [];
  const views = article.views || article.visualizacoes || 0;
  
  const wordCount = conteudo.trim().split(/\s+/).filter((w: string) => w.length > 0).length || 0;
  const readTime = Math.ceil(wordCount / 200) + " MIN READ";
  
  const dataPublicacao = article.data_publicacao || article.createdAt || article.date || article.criadoEm || new Date().toISOString();
  
  const autorNome = article?.autor?.nome ?? 'Autor Desconhecido';
  const autorBio = article?.autor?.bio ?? 'Escreve sobre as ideias que cruzam as fronteiras do design, engenharia e do futuro da tecnologia.';
  
  const imageUrl = article.imagem_banner_url || (article.image ? getImageUrl(article.image) : null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  const contentParagraphs = conteudo.split('\n\n').filter((p: string) => p.trim());

  return (
    <div className="min-h-screen bg-background text-on-background font-body relative pb-16 lg:pb-0">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
        
        {/* Sidebar: Reading Progress & Actions */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
          <div className="flex flex-col items-center gap-8 py-4">
            <div className="w-1 h-48 bg-surface-container rounded-full relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-75"
                style={{ height: `${scrollProgress}%` }}
              ></div>
            </div>
            
            <div className="flex flex-col gap-6 text-on-surface-variant">
              <button onClick={handleLike} className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                <span className={`material-symbols-outlined ${isLiked ? 'text-primary' : ''}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                <span className="font-label text-[10px] font-bold group-hover:text-primary">{likesCount >= 1000 ? (likesCount/1000).toFixed(1)+'K' : likesCount}</span>
              </button>
              
              <button onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                <span className="material-symbols-outlined">chat_bubble</span>
                <span className="font-label text-[10px] font-bold group-hover:text-primary">{article.comentarios?.length || 0}</span>
              </button>
              
              <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                <span className={`material-symbols-outlined ${isBookmarked ? 'text-primary' : ''}`} style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                <span className="font-label text-[10px] font-bold group-hover:text-primary">{isBookmarked ? 'SAVED' : 'SAVE'}</span>
              </button>
              
              <button onClick={handleShare} className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                <span className="material-symbols-outlined">share</span>
                <span className="font-label text-[10px] font-bold group-hover:text-primary">SHARE</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Article Content */}
        <article className="lg:col-span-8 lg:col-start-2">
          {/* Header */}
          <header className="mb-12 lg:mb-16">
            <div className="flex items-center justify-between lg:justify-start lg:gap-3 mb-6">
              <span className="font-label text-xs tracking-widest text-tertiary bg-tertiary-fixed px-3 py-1 rounded-full font-bold uppercase">{categoria}</span>
              <span className="font-label text-xs text-secondary font-medium hidden lg:inline">{readTime}</span>
              <span className="font-label text-xs text-secondary font-medium lg:hidden">{formatDate(dataPublicacao)}</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl text-on-surface leading-[1.1] mb-6 lg:mb-8 font-extrabold tracking-tight">
              {titulo}
            </h1>
            {resumo && (
              <p className="font-body text-xl md:text-2xl text-secondary italic border-l-4 border-primary pl-6 lg:pl-8 py-2">
                {resumo}
              </p>
            )}
          </header>

          {/* Lead Image */}
          <div className="mb-12 lg:mb-16 rounded-xl overflow-hidden relative group">
            {imageUrl ? (
              <>
                <div className="absolute inset-0 blueprint-grid opacity-20 z-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
                <img 
                  src={imageUrl} 
                  alt={titulo}
                  className="w-full aspect-video lg:aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </>
            ) : (
              <div className="w-full aspect-video lg:aspect-[21/9] bg-surface-container relative">
                <div className="absolute inset-0 blueprint-grid opacity-40"></div>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 z-20 font-label text-[10px] text-white/90 bg-black/40 backdrop-blur-md px-2 py-1 font-bold tracking-widest uppercase border border-white/10 rounded">
              PLATE NO. {(article.id || 0).toString().padStart(3, '0')}
            </div>
          </div>

          {/* Body Text */}
          <div className="font-body text-lg lg:text-xl leading-relaxed text-on-surface space-y-6 lg:space-y-8 max-w-3xl">
            {contentParagraphs.map((paragraph: string, index: number) => {
              // Detect H2
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="font-headline text-2xl lg:text-3xl font-bold pt-8 pb-4 border-b border-outline-variant/30 text-on-surface">
                    {paragraph.replace(/^##\s*/, '')}
                  </h2>
                );
              }
              // Detect H3 or single #
              if (paragraph.startsWith('# ')) {
                return (
                  <h3 key={index} className="font-headline text-xl lg:text-2xl font-bold mt-10 mb-4 text-on-surface">
                    {paragraph.replace(/^#\s*/, '')}
                  </h3>
                );
              }
              // Detect Blockquote
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-10 font-body italic text-[20px] lg:text-[22px] text-secondary bg-surface-container-low/50 rounded-r-lg">
                    {paragraph.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }
              // Code Block (simulação básica)
              if (paragraph.startsWith('```')) {
                const codeContent = paragraph.replace(/```\w*\n?/, '').replace(/```$/, '');
                return (
                  <div key={index} className="my-10 rounded-xl overflow-hidden bg-inverse-surface border border-outline-variant/10">
                    <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
                      <span className="font-label text-xs text-secondary-fixed font-bold tracking-widest uppercase text-white/50">Snippet</span>
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-error/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/80"></div>
                      </div>
                    </div>
                    <pre className="p-6 font-mono text-xs lg:text-sm overflow-x-auto leading-relaxed text-surface-bright/90">
                      {codeContent}
                    </pre>
                  </div>
                );
              }
              
              // Standard text
              return (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] mr-4">Tags:</span>
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  to={`/categorias?tipo=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-surface-container-low border border-outline-variant/30 text-secondary text-[11px] font-label font-bold uppercase tracking-widest rounded hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Card */}
          <section className="mt-16 lg:mt-24 p-8 lg:p-12 bg-surface-container-low rounded-xl relative overflow-hidden border border-outline-variant/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-on-surface pointer-events-none">
              <span className="material-symbols-outlined text-8xl lg:text-9xl">architecture</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 lg:gap-8 relative z-10">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-surface-container-highest border-2 border-primary-container shrink-0 flex items-center justify-center text-3xl font-headline font-bold text-secondary">
                {article?.autor?.avatar ? (
                    <img src={getImageUrl(article.autor.avatar) || undefined} alt={autorNome} className="w-full h-full object-cover" />
                ) : (
                   autorNome.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-headline text-2xl font-bold mb-1 text-on-surface">{autorNome}</h4>
                <p className="font-label text-xs text-primary font-bold uppercase tracking-[0.2em] mb-4">Systems Architect & Lead Contributor</p>
                <p className="font-body text-secondary max-w-xl text-sm lg:text-base">
                  {autorBio}
                </p>
                <div className="flex justify-center md:justify-start gap-4 mt-6">
                  <button className="font-label text-[10px] font-bold text-on-surface hover:text-primary transition-colors border-b-2 border-outline-variant/30 pb-1 uppercase tracking-widest">FOLLOW RESEARCH</button>
                  <button className="font-label text-[10px] font-bold text-on-surface hover:text-primary transition-colors border-b-2 border-outline-variant/30 pb-1 uppercase tracking-widest">VIEW ARCHIVE</button>
                </div>
              </div>
            </div>
          </section>

          {/* Comment Section Placeholder */}
          <section id="comments" className="mt-16 pt-8 border-t border-outline-variant/20">
            <CommentSection articleId={id || ''} />
          </section>
        </article>

        {/* Right Column (Desktop Metadata) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-12">
          {/* Technical Ledger */}
          <div className="p-8 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h5 className="font-label text-xs font-extrabold text-secondary uppercase tracking-[0.2em] mb-6">Technical Ledger</h5>
            <ul className="space-y-4">
              <li className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="font-label text-[10px] text-secondary font-medium tracking-widest">VERSION</span>
                <span className="font-mono text-[10px] text-on-surface font-bold">1.0.{(article.id || 4).toString().padStart(2, '0')}-BUILD</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="font-label text-[10px] text-secondary font-medium tracking-widest">DATE</span>
                <span className="font-mono text-[10px] text-on-surface font-bold">{formatDate(dataPublicacao)}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="font-label text-[10px] text-secondary font-medium tracking-widest">VIEWS</span>
                <span className="font-mono text-[10px] text-on-surface font-bold">{views}</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="font-label text-[10px] text-secondary font-medium tracking-widest">LATENCY</span>
                <span className="font-mono text-[10px] text-tertiary font-bold px-2 bg-tertiary/10 rounded">LOW</span>
              </li>
            </ul>
          </div>

          {/* Related Deep Dives */}
          {relatedArticles.length > 0 && (
            <div className="space-y-6">
              <h5 className="font-label text-xs font-extrabold text-secondary uppercase tracking-[0.2em]">Related Deep Dives</h5>
              <div className="flex flex-col gap-6">
                {relatedArticles.map(rel => (
                  <Link to={`/artigo/${rel.id}`} key={rel.id} className="group cursor-pointer block border-l-2 border-outline-variant/30 pl-4 hover:border-primary transition-colors">
                    <p className="font-headline text-lg font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2 text-on-surface">
                      {rel.titulo}
                    </p>
                    <p className="font-label text-[10px] text-secondary mt-2 font-bold tracking-widest">{formatDate(rel.data_publicacao || '')}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      <Footer />

      {/* Mobile Action Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-4 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-xl border-t border-stone-200/20 dark:border-stone-800/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button onClick={handleLike} className="flex flex-col items-center justify-center rounded-xl px-4 py-2 text-stone-500 dark:text-stone-400">
          <span className={`material-symbols-outlined ${isLiked ? 'text-primary' : ''}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          <span className="font-label text-[10px] font-bold tracking-widest mt-1">{likesCount}</span>
        </button>
        <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center justify-center rounded-xl px-4 py-2 text-stone-500 dark:text-stone-400">
          <span className={`material-symbols-outlined ${isBookmarked ? 'text-primary' : ''}`} style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
          <span className="font-label text-[10px] font-bold tracking-widest mt-1">SAVE</span>
        </button>
        <button onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center justify-center rounded-xl px-4 py-2 text-stone-500 dark:text-stone-400">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="font-label text-[10px] font-bold tracking-widest mt-1">{article.comentarios?.length || 0}</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center justify-center rounded-xl px-4 py-2 text-stone-500 dark:text-stone-400">
          <span className="material-symbols-outlined">share</span>
          <span className="font-label text-[10px] font-bold tracking-widest mt-1">SHARE</span>
        </button>
      </nav>
    </div>
  );
}