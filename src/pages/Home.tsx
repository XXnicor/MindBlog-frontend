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
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6">
        <section className="text-center py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold">Explore o Futuro da <span className="text-cyan-500">Tecnologia</span></h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/artigos" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-6 py-2 rounded-md font-semibold transition-colors">Explorar Artigos</Link>
            <Link to="/register" className="border border-slate-800 text-white px-6 py-2 rounded-md hover:border-slate-600 transition-colors">Começar a Escrever</Link>
          </div>
        </section>

        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Artigos em Destaque</h2>
            <Link to="/artigos" className="text-cyan-500 hover:text-cyan-400 transition-colors">Ver todos →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-white">Erro ao carregar artigos</h3>
              <p className="text-slate-400 mb-4">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-8 mt-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Mail className="text-cyan-500 w-12 h-12" />
            <div>
              <h3 className="text-white text-xl font-semibold">Newsletter Semanal</h3>
              <p className="text-gray-400">Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteúdo de qualidade.</p>
            </div>
            <form className="flex gap-2 mt-4 md:mt-0">
              <input type="email" placeholder="exemplo@email.com" className="px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors" />
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-4 py-2 rounded-md font-medium transition-colors">Inscrever</button>
            </form>
          </div>
        </section>

        <section className="mt-12 text-center">
          <h3 className="text-white text-lg font-semibold">Compartilhe Seu Conhecimento</h3>
          <p className="text-gray-400 mt-2">Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia</p>
          <div className="mt-4"><Link to="/register" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-4 py-2 rounded-md font-semibold transition-colors">Criar Conta Gratuita</Link></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}