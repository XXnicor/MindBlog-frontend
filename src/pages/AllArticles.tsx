import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const { articles, loading, error, pagination } = useArticles(currentPage, 9, {
    categoria: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined
  });

  const categories = ['all', 'Dev', 'DevOps', 'IA'];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para obter nome do autor de forma segura
  const getAuthorName = (article: Article): string => {
    if (article?.autor?.nome) {
      return article.autor.nome;
    }
    if (typeof article.author === 'string') {
      return article.author;
    }
    if (article.authorName) {
      return article.authorName;
    }
    return 'Autor Desconhecido';
  };

  // Calcular tempo de leitura
  const getReadTime = (article: Article): string => {
    if (article.tempoLeitura) return article.tempoLeitura;
    if (article.readTime) return article.readTime;
    
    // Calcular baseado no conteúdo
    const content = article.conteudo || '';
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes}min`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cabeçalho da Página */}
        <section className="bg-slate-950 py-16 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">
              Todos os <span className="text-blue-400">Artigos</span>
            </h1>
            <p className="text-xl text-slate-400">
              Explore nossa coleção completa de artigos técnicos
            </p>
          </div>
        </section>

        {/* Barra de Controle (Search & Filter) */}
        <section className="bg-slate-950 py-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Input de Busca */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Filtros e Visualização */}
              <div className="flex gap-3 items-center w-full md:w-auto">
                {/* Dropdown de Categoria */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-initial bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Botões de Visualização */}
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-slate-900'
                        : 'bg-transparent text-slate-400 hover:text-white'
                    }`}
                    title="Visualização em Grid"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-cyan-500 text-slate-900'
                        : 'bg-transparent text-slate-400 hover:text-white'
                    }`}
                    title="Visualização em Lista"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contador de Resultados */}
            <div className="mt-4 text-sm text-slate-400">
              {loading ? (
                'Carregando...'
              ) : error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <>
                  {pagination?.totalItems || 0} {pagination?.totalItems === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                  {searchTerm && ` para "${searchTerm}"`}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Grid de Artigos */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ArticleListItemSkeleton key={i} />
                  ))}
                </div>
              )
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-2">Erro ao carregar artigos</h3>
                <p className="text-slate-400 mb-4">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold mb-2">Nenhum artigo encontrado</h3>
                <p className="text-slate-400">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              // MODO GRID: 3 colunas
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              // MODO LISTA: Cards Horizontais
              <div className="flex flex-col gap-4">
                {articles.map((article) => (
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors cursor-pointer flex flex-col md:flex-row">
                      {/* Imagem à Esquerda (Desktop) / Topo (Mobile) */}
                      <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
                        {article.imagem_banner_url || getImageUrl(article.imagem || article.image) ? (
                          <img
                            src={article.imagem_banner_url || getImageUrl(article.imagem || article.image)!}
                            alt={article.titulo || article.title || 'Imagem do artigo'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-600 text-2xl">M</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="text-slate-600 text-2xl font-bold">M</div>
                        )}
                      </div>

                      {/* Conteúdo à Direita */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">
                              {article.categoria ?? article.category ?? 'Sem categoria'}
                            </span>
                            {article.highlight && (
                              <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded">
                                Destaque
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">
                            {article.titulo || article.title || 'Sem título'}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                            {article.resumo || article.summary || ''}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-slate-400 text-sm border-t border-slate-800 pt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-300">{getAuthorName(article)}</span>
                            {article.data_publicacao && (
                              <>
                                <span>•</span>
                                <span>{new Date(article.data_publicacao).toLocaleDateString('pt-BR')}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{getReadTime(article)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={16} />
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
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    // Mostrar apenas algumas páginas ao redor da atual
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-cyan-500 text-slate-900 font-bold'
                              : 'bg-slate-900 border border-slate-800 text-white hover:bg-slate-800'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-slate-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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