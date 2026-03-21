import { Link } from 'react-router-dom';
import { Article } from '../types/article';
// Note: We'll assume image util can be handled differently or we use a basic fallback
// since getImageUrl might only accept certain params. Let's just use string fallback.

interface HeroArticleProps {
  article: Article;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const authorName = article?.autor?.nome ?? 'Unknown Author';
  const authorBio = article?.autor?.bio ?? '';
  
  // Try taking banner image first, passing fallback
  let imageUrl = article.imagem_banner_url;
  if (!imageUrl && article.image) {
    // If there is another image field, it might be partial or full URL
    imageUrl = article.image.startsWith('http') ? article.image : `http://localhost:3000${article.image}`;
  }

  const wordCount = article.conteudo?.trim().split(/\s+/).filter((w: string) => w.length > 0).length || 200;
  const readTime = Math.ceil(wordCount / 200) + ' Min Read';

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="lg:col-span-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold">Resumo em Destaque</span>
            <span className="w-12 h-[1px] bg-outline-variant/30"></span>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary">{readTime.replace('Min Read', 'min de leitura')}</span>
          </div>
          
          <h1 className="font-headline text-5xl md:text-7xl font-bold leading-[1.1] text-on-surface mb-8 tracking-tight">
            {article.titulo}
          </h1>
          
          <p className="font-body text-lg md:text-xl text-secondary leading-relaxed mb-10 max-w-2xl">
            {article.resumo || 'Um olhar aprofundado sobre tecnologia, design e as ideias que moldam o nosso amanhã.'}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-label text-sm font-bold text-on-surface">{authorName}</span>
              <span className="font-label text-xs text-secondary">{authorBio || 'Arquiteto Principal'}</span>
            </div>
            <Link to={`/artigo/${article.id}`} className="ml-auto text-primary font-label text-sm font-bold flex items-center gap-2 group">
              LER ARTIGO COMPLETO
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
        
         {/* Right Column: Image */}
         <div className="lg:col-span-5 relative">
           <div className="aspect-[4/5] bg-surface-container-high rounded-xl overflow-hidden relative group">
             {imageUrl ? (
               <>
                 <img 
                   src={imageUrl} 
                   alt={article.titulo}
                   className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                   loading="lazy"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     e.currentTarget.nextElementSibling?.removeAttribute('hidden');
                   }}
                 />
                 <div className="absolute inset-0 hidden">
                   <div className="absolute inset-0 blueprint-grid opacity-40"></div>
                 </div>
                 <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none"></div>
               </>
             ) : (
               <div className="absolute inset-0 blueprint-grid opacity-40"></div>
             )}
           </div>
          
          {/* Floating Element */}
          <div className="absolute -bottom-6 -left-12 hidden lg:block bg-surface-container-lowest p-6 shadow-xl rounded-xl border border-outline-variant/10 max-w-[240px]">
            <span className="font-mono text-tertiary text-[10px] block mb-2">LOG_SISTEMA_{(article.id || 42).toString().padStart(3, '0')}</span>
            <p className="font-label text-xs leading-relaxed text-secondary">
              "A fronteira entre a intenção humana e a execução da máquina está se dissolvendo."
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
