import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Heart, TrendingUp, Settings, Plus, Edit, Trash } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock Data - Estatísticas
const STATS = [
  { id: 1, title: 'Total de Artigos', value: '2', icon: FileText, color: 'text-cyan-500' },
  { id: 2, title: 'Engajamento', value: '4', icon: MessageCircle, color: 'text-green-500' },
  { id: 3, title: 'Curtidas', value: '20', icon: Heart, color: 'text-red-500' },
  { id: 4, title: 'Tempo médio de leitura', value: '8 min', icon: TrendingUp, color: 'text-purple-500' },
];

// Mock Data - Artigos do usuário
const INITIAL_ARTICLES = [
  {
    id: 1,
    title: 'O Futuro da Inteligência Artificial',
    excerpt: 'Explorando as tendências e inovações que moldarão o futuro da IA nos próximos anos.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop',
    date: '20 jan 2026',
    comments: 8,
    likes: 45,
  },
  {
    id: 2,
    title: 'Guia Completo de TypeScript',
    excerpt: 'Aprenda TypeScript do zero com exemplos práticos e dicas avançadas.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop',
    date: '18 jan 2026',
    comments: 12,
    likes: 67,
  },
];

// Mock Data - Atividades recentes
const RECENT_ACTIVITY = [
  {
    id: 1,
    user: 'Marie Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    action: 'comentou em',
    article: 'O Futuro da IA...',
    time: '5 min atrás',
  },
  {
    id: 2,
    user: 'John Anderson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    action: 'curtiu',
    article: 'Guia Completo de TypeScript',
    time: '1 hora atrás',
  },
  {
    id: 3,
    user: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    action: 'comentou em',
    article: 'O Futuro da IA...',
    time: '2 horas atrás',
  },
  {
    id: 4,
    user: 'Mike Wilson',
    avatar: 'https://i.pravatar.cc/150?img=7',
    action: 'seguiu você',
    article: '',
    time: '3 horas atrás',
  },
];

export default function Dashboard() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  const handleOpenDeleteModal = (id: number) => {
    setArticleToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete !== null) {
      console.log(`Artigo ${articleToDelete} deletado`);
      setArticles(articles.filter(article => article.id !== articleToDelete));
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400">
              Bem-vindo de volta, John Doe!
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 rounded-lg transition-colors"
            >
              <Settings size={18} />
              Configurações
            </Link>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <Plus size={18} />
              Novo Artigo
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-400 text-sm">{stat.title}</h3>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: My Articles (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Meus Artigos</h2>
              
              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">Você ainda não tem artigos publicados</p>
                  <Link
                    to="/new"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
                  >
                    <Plus size={18} />
                    Criar Primeiro Artigo
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                    >
                      {/* Image */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{article.date}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {article.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={14} />
                            {article.likes}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link
                          to={`/edit/${article.id}`}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(article.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recent Activity (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Atividade Recente</h2>
              
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    {/* Avatar */}
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 mb-1">
                        <span className="font-semibold text-white">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        {activity.article && (
                          <span className="font-semibold text-white">{activity.article}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-xl font-bold text-white mb-2">
              Excluir Artigo
            </h2>
            <p className="text-slate-400 text-sm">
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </p>

            {/* Footer / Ações */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
