import { Link } from 'react-router-dom';
import { getImageUrl } from '../lib/imageUtils';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'featured'; // Retido para não quebrar componentes existentes
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const imageUrl = article.imagem_banner_url || (article.image ? getImageUrl(article.image) : null);
  
  const formattedDate = article.data_publicacao 
    ? new Date(article.data_publicacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    : "15 mar. 2024";

  return (
    <Link to={`/artigo/${article.id}`} className="group cursor-pointer flex flex-col h-full">
      <div className="aspect-video bg-surface-container mb-6 overflow-hidden rounded-xl relative group-hover:shadow-lg transition-shadow duration-500">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={article.titulo}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.removeAttribute('hidden');
              }}
            />
            <div className="absolute inset-0 hidden">
              <div className="absolute inset-0 blueprint-grid opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary/30">
                <span className="material-symbols-outlined text-4xl">article</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 blueprint-grid opacity-40"></div>
            <div className="absolute inset-0 flex items-center justify-center text-primary/30">
              <span className="material-symbols-outlined text-4xl">article</span>
            </div>
          </>
        )}
        
        <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded text-[10px] font-mono text-tertiary border border-outline-variant/20 uppercase shadow-sm">
          TAG: {article.categoria || 'EDITORIAL'}
        </div>
        
        {/* Destaque Badge se mantido pelo negócio */}
        {article.highlight && (
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-primary text-on-primary text-[10px] uppercase font-mono rounded shadow-sm">
              Destaque
            </span>
          </div>
        )}
      </div>
      
      <h3 className="font-headline text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-3">
        {article.titulo}
      </h3>
      
      <p className="font-body text-secondary text-sm leading-relaxed mb-6 line-clamp-2">
        {article.resumo || 'Um olhar aprofundado sobre tecnologia, design e as ideias que moldam o amanhã.'}
      </p>
      
      <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4 mt-auto">
        <span className="font-label text-[10px] text-secondary uppercase tracking-widest">{formattedDate}</span>
        <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">north_east</span>
      </div>
    </Link>
  );
}