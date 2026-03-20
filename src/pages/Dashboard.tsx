import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Heart, TrendingUp, Settings, Plus, Edit, Trash, Loader2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { articleService, userService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';
import { Article, Stats } from '../types/article';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [articlesData, statsData] = await Promise.all([
        articleService.getMyArticles(1, 50),
        userService.getStats()
      ]);
      
      setArticles(articlesData.articles || []);
      setStats(statsData || null);
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setArticleToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (articleToDelete !== null) {
      setDeleting(true);
      try {
        await articleService.delete(articleToDelete);
        setArticles(articles.filter(article => article.id !== articleToDelete));
        handleCloseDeleteModal();
        const statsData = await userService.getStats();
        setStats(statsData || null);
        alert('Artigo deletado com sucesso!');
      } catch (error: any) {
        console.error('[Dashboard] Erro ao deletar artigo:', error);
        
        if (error.message.includes('permissão')) {
          alert(
            '❌ Erro de Permissão\n\n' +
            'O backend não reconheceu você como autor deste artigo.\n\n' +
            'Possíveis causas:\n' +
            '1. O artigo foi criado com outro usuário\n' +
            '2. O backend não está associando o autor corretamente ao criar artigos\n' +
            '3. Há um problema na verificação de permissões no backend\n\n' +
            'Verifique o console do backend para mais detalhes.'
          );
        } else {
          alert('Erro ao deletar artigo: ' + error.message);
        }
      } finally {
        setDeleting(false);
      }
    }
  };

  // Helper para obter dados do artigo de forma segura
  const getArticleTitle = (article: Article): string => {
    return article.titulo || article.title || 'Sem título';
  };

  const getArticleSummary = (article: Article): string => {
    return article.resumo || article.summary || '';
  };

  const getArticleCategory = (article: Article): string => {
    return article.categoria || article.category || 'Sem categoria';
  };

  const getArticleDate = (article: Article): string => {
    const date = article.data_publicacao || article.createdAt || article.date || article.criadoEm;
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getArticleImage = (article: Article): string => {
    const imageUrl = article.imagem_banner_url || getImageUrl(article.imagem || article.image);
    return imageUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop';
  };

  const getArticleViews = (article: Article): number => {
    return article.views || article.visualizacoes || 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400">
              Bem-vindo de volta, {user?.nome || user?.nome || 'Usuário'}!
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
              to="/artigos/novo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <Plus size={18} />
              Novo Artigo
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            <p className="font-medium">Erro ao carregar dados</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-2 px-4 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-sm transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-400 text-sm">Total de Artigos</h3>
                  <FileText className="w-6 h-6 text-cyan-500" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalArticles || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-400 text-sm">Visualizações</h3>
                  <Eye className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalViews || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-400 text-sm">Curtidas</h3>
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalLikes || 0}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-400 text-sm">Comentários</h3>
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalComments || 0}</p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Meus Artigos</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">Você ainda não tem artigos publicados</p>
                  <Link
                    to="/artigos/novo"
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
                      <img
                        src={getArticleImage(article)}
                        alt={getArticleTitle(article)}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {getArticleTitle(article)}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                          {getArticleSummary(article)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{getArticleDate(article)}</span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {getArticleViews(article)}
                          </span>
                          <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded">
                            {getArticleCategory(article)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link
                          to={`/artigos/editar/${article.id}`}
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

          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Atividade Recente</h2>
              
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />

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

      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-2">
              Excluir Artigo
            </h2>
            <p className="text-slate-400 text-sm">
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="px-4 py-2 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}