import { Link } from 'react-router-dom';
import { Article } from '../types/article';

interface CategoryBarProps {
  articles: Article[];
}

export default function CategoryBar({ articles }: CategoryBarProps) {
  // Extract unique categories safely
  const categories = Array.from(new Set(articles.map(a => a.categoria).filter(Boolean)));
  const displayCategories = categories.length > 0 
    ? categories.slice(0, 4) 
    : ['AI Research', 'Engineering Culture', 'Architecture', 'System Design'];

  return (
    <section className="border-y border-outline-variant/10 bg-surface-container-low mb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8 md:gap-12">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold whitespace-nowrap hidden sm:inline">
            Explore Branches
          </span>
          <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {displayCategories.map((cat, idx) => (
              <Link 
                key={idx}
                to={`/categorias?tipo=${encodeURIComponent(cat as string)}`} 
                className="font-headline text-lg md:text-xl text-on-surface hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <Link to="/categorias" className="hidden md:flex items-center gap-2 font-label text-xs font-bold text-tertiary border border-tertiary/20 px-4 py-2 rounded-full hover:bg-tertiary/5 transition-colors whitespace-nowrap">
          ALL CATEGORIES <span className="material-symbols-outlined text-sm flex items-center">filter_list</span>
        </Link>
      </div>
    </section>
  );
}
