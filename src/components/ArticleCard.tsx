import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { getImageUrl } from '../lib/imageUtils';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Acesso seguro ao autor com optional chaining
  const authorName = article?.autor?.nome ?? 'Autor Desconhecido';
  
  // Imagem: priorizar imagem_banner_url, senão image (que pode ser nome de arquivo)
  const imageUrl = article.imagem_banner_url || getImageUrl(article.image);
  
  // Calcular tempo de leitura estimado (200 palavras por minuto)
  const wordsPerMinute = 200;
  const wordCount = article.conteudo?.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return (
    <Link 
      to={`/artigo/${article.id}`}
      className="group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-600 text-4xl font-bold">M</div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl font-bold">
            M
          </div>
        )}
        
        {/* Badge de categoria */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-cyan-400 text-xs font-semibold rounded-full border border-slate-700">
            {article.categoria ?? 'Sem categoria'}
          </span>
        </div>

        {/* Badge de destaque */}
        {article.highlight && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1 bg-cyan-500/90 text-slate-900 text-xs font-bold rounded-full">
              DESTAQUE
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {article.titulo}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {article.resumo ?? ''}
        </p>

        {/* Meta informações */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            {/* Avatar do autor */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {authorName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span className="truncate max-w-[100px]">{authorName}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{readTime}min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{article.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}