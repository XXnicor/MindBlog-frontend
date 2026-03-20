import ArticleCard from './ArticleCard';
import { Article } from '../types/article';
import ArticleCardSkeleton from './ArticleCardSkeleton';
import { Link } from 'react-router-dom';

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
}

export default function ArticleGrid({ articles, loading = false }: ArticleGridProps) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 mb-24 text-center py-20 bg-surface-container-low rounded-xl border border-outline-variant/10">
        <div className="mb-4">
          <span className="material-symbols-outlined text-4xl text-tertiary opacity-50 block">article</span>
        </div>
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No articles available</h3>
        <p className="font-body text-secondary max-w-md mx-auto mb-6">Explore other areas or come back later for new insights.</p>
        <Link to="/artigos/novo" className="font-label text-sm font-bold text-primary border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/5 transition-colors inline-block">
          WRITE FIRST ARTICLE
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
