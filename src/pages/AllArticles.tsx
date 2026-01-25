import { useState } from 'react';
import { Search, LayoutGrid, List, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Article } from '../components/ArticleCard';

type ViewMode = 'grid' | 'list';

// Mock Data para testes visuais
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Introdução ao React 19: Novidades e Recursos',
    summary: 'Explore as novidades do React 19, incluindo Server Components, Actions e melhorias de performance que revolucionam o desenvolvimento web.',
    category: 'Desenvolvimento web',
    author: 'Ana Silva',
    readTime: '8 min',
    date: '20 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/cyan?text=React+19',
    views: 1250
  },
  {
    id: '2',
    title: 'DevOps: Do Zero ao Deploy Automatizado',
    summary: 'Aprenda a configurar pipelines de CI/CD com GitHub Actions, Docker e Kubernetes para automatizar seus deploys de forma profissional.',
    category: 'DevOps',
    author: 'Carlos Santos',
    readTime: '12 min',
    date: '18 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/pink?text=DevOps',
    views: 890
  },
  {
    id: '3',
    title: 'Machine Learning com Python: Primeiros Passos',
    summary: 'Descubra como começar sua jornada em ML utilizando Python, pandas, scikit-learn e técnicas fundamentais de análise de dados.',
    category: 'AI',
    author: 'Maria Oliveira',
    readTime: '15 min',
    date: '15 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/orange?text=Machine+Learning',
    views: 2100,
    highlight: true
  },
  {
    id: '4',
    title: 'TypeScript Avançado: Generics e Utility Types',
    summary: 'Domine recursos avançados do TypeScript para criar código mais seguro, reutilizável e com melhor inferência de tipos.',
    category: 'Desenvolvimento web',
    author: 'Pedro Ferreira',
    readTime: '10 min',
    date: '12 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/blue?text=TypeScript',
    views: 1580
  },
  {
    id: '5',
    title: 'Kubernetes na Prática: Escalando Aplicações',
    summary: 'Aprenda a orquestrar containers com Kubernetes, desde conceitos básicos até estratégias avançadas de scaling e alta disponibilidade.',
    category: 'DevOps',
    author: 'João Costa',
    readTime: '18 min',
    date: '10 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/purple?text=Kubernetes',
    views: 1720
  },
  {
    id: '6',
    title: 'ChatGPT e APIs: Integrando IA nos Seus Projetos',
    summary: 'Veja como integrar a API do OpenAI em suas aplicações para criar chatbots inteligentes, assistentes virtuais e muito mais.',
    category: 'AI',
    author: 'Beatriz Lima',
    readTime: '14 min',
    date: '8 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/green?text=ChatGPT+API',
    views: 3200
  },
  {
    id: '7',
    title: 'Clean Code: Princípios para Código Sustentável',
    summary: 'Descubra os princípios fundamentais do Clean Code e como escrever código que seja fácil de manter, testar e escalar.',
    category: 'Desenvolvimento web',
    author: 'Rafael Souza',
    readTime: '9 min',
    date: '5 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/yellow?text=Clean+Code',
    views: 1950
  },
  {
    id: '8',
    title: 'Docker Compose: Orquestrando Múltiplos Containers',
    summary: 'Aprenda a usar Docker Compose para gerenciar aplicações multi-container de forma simples e eficiente.',
    category: 'DevOps',
    author: 'Luciana Mendes',
    readTime: '11 min',
    date: '3 jan 2025',
    image: 'https://placehold.co/600x400/1e293b/red?text=Docker+Compose',
    views: 1340
  }
];

export default function AllArticles() {
  const [articles] = useState<Article[]>(MOCK_ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filtragem client-side
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Extrai categorias únicas dos artigos
  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

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
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
              {searchTerm && ` para "${searchTerm}"`}
            </div>
          </div>
        </section>

        {/* Grid de Artigos */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {filteredArticles.length === 0 ? (
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
                {filteredArticles.map((article) => (
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article
                      className={`bg-slate-900 border ${
                        article.highlight ? 'border-cyan-500' : 'border-slate-800'
                      } rounded-lg overflow-hidden hover:border-slate-700 transition-colors cursor-pointer`}
                    >
                    {/* Imagem no Topo */}
                    <div className="h-48 bg-gradient-to-br from-pink-300 to-sky-200 flex items-center justify-center">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
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
                        <div>{article.author}</div>
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
                {filteredArticles.map((article) => (
                  <Link key={article.id} to={`/artigo/${article.id}`}>
                    <article
                      className={`bg-slate-900 border ${
                        article.highlight ? 'border-cyan-500' : 'border-slate-800'
                      } rounded-lg overflow-hidden hover:border-slate-700 transition-colors cursor-pointer flex flex-col md:flex-row`}
                    >
                    {/* Imagem à Esquerda (Desktop) / Topo (Mobile) */}
                    <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-pink-300 to-sky-200 flex items-center justify-center flex-shrink-0">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
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
                          <span className="font-medium text-slate-300">{article.author}</span>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
