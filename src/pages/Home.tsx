import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { useArticles } from '../hooks/useArticles';
import { Mail } from 'lucide-react';
import { ArticleCardSkeleton } from '../components/ui/Skeleton';

export default function Home(){
  const { articles, loading, error } = useArticles(1, 6);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6">
        <section className="text-center py-24">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[var(--color-ink)]">Explore o Futuro da <span className="text-[var(--color-accent)]">Tecnologia</span></h1>
          <p className="text-[var(--color-ink-light)] font-body mt-4 max-w-2xl mx-auto">Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/artigos" className="btn-primary">Explorar Artigos</Link>
            <Link to="/register" className="btn-outline border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors">Começar a Escrever</Link>
          </div>
        </section>

        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold text-[var(--color-ink)]">Artigos em Destaque</h2>
            <Link to="/artigos" className="text-[var(--color-accent)] hover:opacity-80 transition-opacity font-medium">Ver todos →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-ink)]">Erro ao carregar artigos</h3>
              <p className="text-[var(--color-ink-light)] mb-4">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-[var(--color-paper-alt)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 mb-12 mt-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-[var(--color-paper)] p-4 rounded-full shadow-sm">
              <Mail className="text-[var(--color-accent)] w-10 h-10" />
            </div>
            <div className="text-left">
              <h3 className="text-[var(--color-ink)] text-2xl font-display font-bold mb-2">Newsletter Semanal</h3>
              <p className="text-[var(--color-ink-light)] max-w-md">Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteúdo de qualidade.</p>
            </div>
            <form className="flex w-full md:w-auto gap-3 mt-6 md:mt-0 flex-col md:flex-row">
              <input type="email" placeholder="exemplo@email.com" className="form-input md:w-[280px]" />
              <button type="submit" className="btn-primary">Inscrever</button>
            </form>
          </div>
        </section>

        <section className="mt-16 mb-24 text-center">
          <h3 className="text-[var(--color-ink)] text-2xl font-display font-bold">Compartilhe Seu Conhecimento</h3>
          <p className="text-[var(--color-ink-light)] mt-3 max-w-lg mx-auto">Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia</p>
          <div className="mt-6"><Link to="/register" className="btn-primary">Criar Conta Gratuita</Link></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}