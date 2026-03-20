import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import HeroArticle from '../components/HeroArticle';
import CategoryBar from '../components/CategoryBar';
import ArticleGrid from '../components/ArticleGrid';
import NewsletterSection from '../components/NewsletterSection';
import { useArticles } from '../hooks/useArticles';

export default function Home(){
  // Using limit 7 to get 1 for Hero and 6 for Grid
  const { articles, loading, error } = useArticles(1, 7);

  if (error) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col pt-24 pb-20">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-primary text-6xl mb-4">error</span>
          <h2 className="font-headline text-3xl font-bold mb-4 text-on-surface">System Error: Data Retrieval Failed</h2>
          <p className="font-body text-secondary mb-8 leading-relaxed">
            The neural link to the articles cache was severed. {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-on-primary font-label text-sm font-bold px-8 py-4 rounded-lg hover:bg-primary-container transition-colors shadow-lg uppercase tracking-widest"
          >
            INITIALIZE RECONNECT
          </button>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative">
      <Navbar />

      <main className="pt-32 pb-12 overflow-x-hidden">
        {loading ? (
          <div className="max-w-7xl mx-auto px-6 mb-24">
            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              <div className="lg:col-span-7">
                <div className="h-4 bg-surface-container-high rounded w-32 mb-6 animate-pulse"></div>
                <div className="h-20 bg-surface-container-high rounded w-full mb-4 animate-pulse"></div>
                <div className="h-20 bg-surface-container-high rounded w-5/6 mb-8 animate-pulse"></div>
                <div className="h-6 bg-surface-container-low rounded w-3/4 mb-10 animate-pulse"></div>
                <div className="h-10 bg-surface-container-high rounded w-48 animate-pulse"></div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] bg-surface-container-high rounded-xl animate-pulse"></div>
              </div>
            </div>
            
            {/* Grid Skeleton */}
            <ArticleGrid articles={[]} loading={true} />
          </div>
        ) : (
          <>
            {articles.length > 0 && <HeroArticle article={articles[0]} />}
            <CategoryBar articles={articles} />
            <ArticleGrid articles={articles.slice(1)} />
            <NewsletterSection />
          </>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}