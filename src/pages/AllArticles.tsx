import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Article, PaginationData } from '../types/article';
import { articleService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';

type ViewMode = 'grid' | 'list';

export default function AllArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const itemsPerPage = 9;

  // Carregar artigos da API
  useEffect(() => {
    loadArticles();
  }, [currentPage, selectedCategory, searchTerm]);

  const loadArticles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters: any = {};
      if (selectedCategory !== 'all') {
        filters.categoria = selectedCategory;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await articleService.getAll(currentPage, itemsPerPage, filters);
      
      setArticles(response.articles || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error('Erro ao carregar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
      // Manter dados anteriores em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Extrai categorias únicas dos artigos
  const categories = ['all', 'Dev', 'DevOps', 'IA'];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Carregando artigos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-2">Erro ao carregar artigos</h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <button
                  onClick={loadArticles}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
                >
                  Tentar novamente
                </button>
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
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article
                      className={`bg-slate-900 border ${
                        article.highlight ? 'border-cyan-500' : 'border-slate-800'
                      } rounded-lg overflow-hidden hover:border-slate-700 transition-colors cursor-pointer`}
                    >
                    {/* Imagem no Topo */}
                    <div className="h-48 bg-gradient-to-br from-pink-300 to-sky-200 flex items-center justify-center">
                      {(article.imagem_banner_url || getImageUrl(article.image)) ? (
                        <img
                          src={article.imagem_banner_url || getImageUrl(article.image)!}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML = '<div class="text-slate-900 font-extrabold text-2xl p-6">Lorem<br />ipsum</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="text-slate-900 font-extrabold text-2xl p-6">
                          Lorem<br />ipsum
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <span className="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <h3 className="text-white font-semibold mt-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-400 mt-2 line-clamp-3 text-sm">
                        {article.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-slate-400 text-sm">
                        <div>{typeof article.authorName === 'string' ? article.authorName : (typeof article.author === 'string' ? article.author : 'Autor Desconhecido')}</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  </Link>
                ))}
              </div>
            ) : (
              // MODO LISTA: Cards Horizontais
              <div className="flex flex-col gap-4">
                {articles.map((article) => (
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article
                      className={`bg-slate-900 border ${
                        article.highlight ? 'border-cyan-500' : 'border-slate-800'
                      } rounded-lg overflow-hidden hover:border-slate-700 transition-colors cursor-pointer flex flex-col md:flex-row`}
                    >
                    {/* Imagem à Esquerda (Desktop) / Topo (Mobile) */}
                    <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-pink-300 to-sky-200 flex items-center justify-center flex-shrink-0">
                      {(article.imagem_banner_url || getImageUrl(article.image)) ? (
                        <img
                          src={article.imagem_banner_url || getImageUrl(article.image)!}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML = '<div class="text-slate-900 font-extrabold text-2xl p-6">Lorem<br />ipsum</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="text-slate-900 font-extrabold text-2xl p-6">
                          Lorem<br />ipsum
                        </div>
                      )}
                    </div>

                    {/* Conteúdo à Direita */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-block bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded">
                            {article.category}
                          </span>
                          {article.highlight && (
                            <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded">
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-white font-bold text-xl mb-2">
                          {article.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {article.summary}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-slate-400 text-sm border-t border-slate-800 pt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-300">{typeof article.authorName === 'string' ? article.authorName : (typeof article.author === 'string' ? article.author : 'Autor Desconhecido')}</span>
                          {article.date && (
                            <>
                              <span>•</span>
                              <span>{article.date}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{article.views}</span>
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
