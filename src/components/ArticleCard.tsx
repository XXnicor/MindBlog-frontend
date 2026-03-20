import { Link } from 'react-router-dom';
import { Clock, Eye, Heart } from 'lucide-react';
import { getImageUrl } from '../lib/imageUtils';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'featured';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const authorName = article?.autor?.nome ?? 'Autor Desconhecido';
  const imageUrl = article.imagem_banner_url || getImageUrl(article.image);
  
  const wordsPerMinute = 200;
  const wordCount = article.conteudo?.trim().split(/\\s+/).filter(w => w.length > 0).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Placeholder date as it's not in the Article type currently requested
  const formattedDate = "15 mar.";

  const isFeatured = variant === 'featured';

  return (
    <Link 
      to={`/artigo/${article.id}`}
      className={`group flex flex-col bg-transparent hover:bg-paper-alt hover:-translate-y-1 hover:shadow-md transition-all duration-base rounded-2xl overflow-hidden border border-transparent hover:border-border ${
        isFeatured ? 'md:flex-row md:items-stretch' : ''
      }`}
    >
      {/* Imagem */}
      <div 
        className={`relative overflow-hidden bg-paper-alt shrink-0 ${
          isFeatured ? 'w-full md:w-[55%] h-[280px] md:h-[420px]' : 'w-full aspect-video rounded-xl'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.titulo}
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center text-ink-muted bg-paper-alt pattern-dots"></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted bg-paper-alt pattern-dots">
            {/* Minimal pattern fallback */}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base" />

        {/* Destaque Badge */}
        {article.highlight && (
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-ink text-paper text-[11px] uppercase tracking-wider font-bold rounded-full">
              Destaque
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={`flex flex-col flex-1 ${isFeatured ? 'p-6 md:p-10 justify-center' : 'p-4 pt-1 items-start w-full'}`}>
        
        {/* Categoria badge */}
        <span className="block mt-4 text-[11px] font-medium text-accent uppercase tracking-[0.08em] mb-2 leading-none">
          {article.categoria ?? 'Editorial'}
        </span>

        {/* Título */}
        <h3 
          className={`font-display font-semibold text-ink line-clamp-3 group-hover:text-accent transition-colors duration-fast leading-[1.3] mb-3 ${
            isFeatured ? 'text-[28px] md:text-[36px]' : 'text-[18px] md:text-[20px]'
          }`}
        >
          {article.titulo}
        </h3>
        
        {/* Resumo */}
        {(isFeatured || article.resumo) && (
          <p className="font-body text-[14px] text-ink-light leading-[1.6] line-clamp-3 mb-6">
            {article.resumo ?? 'Um olhar aprofundado sobre tecnologia, design e as ideias que moldam o nosso amanhã.'}
          </p>
        )}

        {/* Meta informações (Rodapé) */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border w-full">
          {/* Autor */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-paper-alt flex items-center justify-center text-ink-light text-[11px] font-bold shrink-0">
              {authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="font-medium text-ink truncate max-w-[120px]">{authorName}</span>
              <span className="text-ink-muted">·</span>
              <span className="text-ink-muted">{formattedDate}</span>
            </div>
          </div>
          
          {/* Métricas */}
          <div className="flex items-center gap-3 text-[12px] text-ink-muted">
            <div className="flex items-center gap-[4px] font-medium">
              <Eye size={14} strokeWidth={2.5} />
              <span>{article.views ?? 0}</span>
            </div>
            <div className="flex items-center gap-[4px] font-medium">
              <Heart size={14} strokeWidth={2.5} />
              <span>{Math.floor((article.views || 0) * 0.12)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}