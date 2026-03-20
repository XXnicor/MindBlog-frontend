import { useState, useEffect, useMemo } from 'react';
import { Search, LayoutGrid, List, Clock, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useArticles } from '../hooks/useArticles';
import { ArticleCardSkeleton, ArticleListItemSkeleton } from '../components/ui/Skeleton';
import ArticleCard from '../components/ArticleCard';
import { getImageUrl } from '../lib/imageUtils';
import { Article } from '../types/article';

type ViewMode = 'grid' | 'list';

export default function AllArticles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useMemo(() => ({
    categoria: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined
  }), [selectedCategory, searchTerm]);

  const { articles, loading, error, pagination } = useArticles(currentPage, 9, filters);

  const categories = ['all', 'Dev', 'DevOps', 'IA'];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAuthorName = (article: Article): string => {
    return article?.autor?.nome || 'Autor Desconhecido';
  };

  const getReadTime = (article: Article): string => {
    const content = article.conteudo || '';
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} MIN READ`;
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cabeçalho da Página */}
        <section className="bg-surface-container-low py-16 border-b border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl font-headline font-bold mb-4 text-on-surface">
              Todos os <span className="text-primary">Artigos</span>
            </h1>
            <p className="text-xl text-secondary font-body">
              Explore nossa coleção completa de artigos técnicos e insights de arquitetura.
            </p>
          </div>
        </section>

        {/* Barra de Controle (Search & Filter) */}
        <section className="bg-surface py-8 border-b border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Input de Busca */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-3 text-on-surface placeholder-secondary focus:outline-none focus:border-primary transition-colors font-label font-bold text-sm tracking-widest uppercase"
                />
              </div>

              {/* Filtros e Visualização */}
              <div className="flex gap-3 items-center w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-initial bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer font-label font-bold text-sm tracking-widest uppercase"
                >
                  <option value="all">TODAS AS CATEGORIAS</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Botões de Visualização */}
                <div className="flex bg-surface-container-low border border-outline-variant/30 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-transparent text-secondary hover:text-on-surface'
                    }`}
                    title="Visualização em Grid"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-transparent text-secondary hover:text-on-surface'
                    }`}
                    title="Visualização em Lista"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contador de Resultados */}
            <div className="mt-4 text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
              {loading ? (
                'Sincronizando cache...'
              ) : error ? (
                <span className="text-error">{error}</span>
              ) : (
                <>
                  {pagination?.totalItems || 0} {pagination?.totalItems === 1 ? 'ARTIGO LOCALIZADO' : 'ARTIGOS LOCALIZADOS'}
                  {searchTerm && ` PARA "${searchTerm.toUpperCase()}"`}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Grid de Artigos */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ArticleListItemSkeleton key={i} />
                  ))}
                </div>
              )
            ) : error ? (
              <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
                <h3 className="text-2xl font-headline font-bold mb-2 text-on-surface">Erro ao carregar artigos</h3>
                <p className="text-secondary font-body mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label font-bold uppercase tracking-widest">Tentar novamente</button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-6xl mb-4">inbox</span>
                <h3 className="text-2xl font-headline font-bold mb-2 text-on-surface">Nenhum artigo encontrado</h3>
                <p className="text-secondary font-body">
                  Tente ajustar os filtros ou buscar por outros termos de pesquisa.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              // MODO LISTA
              <div className="flex flex-col gap-8">
                {articles.map((article) => (
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article className="bg-surface-container-low border border-outline-variant/10 hover:border-primary/50 rounded-xl overflow-hidden transition-all group flex flex-col md:flex-row shadow-sm hover:shadow-md">
                      <div className="md:w-64 h-64 md:h-auto overflow-hidden bg-surface-container relative">
                        <img
                          src={article.imagem_banner_url || getImageUrl(article.imagem || article.image) || ''}
                          alt={article.titulo}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="absolute inset-0 flex items-center justify-center text-primary/20"><span class="material-symbols-outlined text-4xl">article</span></div>';
                            }
                          }}
                        />
                      </div>

                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="font-label text-[10px] font-bold text-tertiary bg-surface-container px-3 py-1 rounded-full uppercase tracking-widest">
                              {article.categoria || article.category || 'Editorial'}
                            </span>
                          </div>
                          
                          <h3 className="text-on-surface font-headline font-bold text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {article.titulo}
                          </h3>
                          <p className="text-secondary font-body text-base leading-relaxed line-clamp-2">
                            {article.resumo || 'Exploração técnica detalhada sobre as novas fronteiras da engenharia e do design.'}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-secondary font-label text-[11px] font-bold uppercase tracking-widest border-t border-outline-variant/10 pt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-on-surface">{getAuthorName(article)}</span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant/30"></span>
                            <span>{article.data_publicacao ? new Date(article.data_publicacao).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-tertiary" />
                              <span>{getReadTime(article)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={14} className="text-tertiary" />
                              <span>{article.views || article.visualizacoes || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Paginação */}
            {!loading && !error && pagination && pagination.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-container hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg transition-all font-label font-bold text-xs ${
                            page === currentPage
                              ? 'bg-primary text-on-primary shadow-md'
                              : 'bg-surface-container-low border border-outline-variant/30 text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-secondary">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-container hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Próxima página"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}