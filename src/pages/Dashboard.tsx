import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Heart, Settings, Plus, Edit, Trash, Loader2, Eye } from 'lucide-react';
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
      } catch (error: any) {
        if (error.message.includes('permissão')) {
          alert(
            '❌ Erro de Permissão\n\nO backend não reconheceu você como autor deste artigo.'
          );
        } else {
          alert('Erro ao deletar artigo: ' + error.message);
        }
      } finally {
        setDeleting(false);
      }
    }
  };

  const getArticleTitle = (article: Article): string => article.titulo || article.title || 'Sem título';
  const getArticleSummary = (article: Article): string => article.resumo || article.summary || '';
  const getArticleCategory = (article: Article): string => article.categoria || article.category || 'Editorial';
  const getArticleDate = (article: Article): string => {
    const date = article.data_publicacao || article.createdAt || article.date || article.criadoEm;
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const getArticleImage = (article: Article): string => {
    const imageUrl = article.imagem_banner_url || getImageUrl(article.imagem || article.image);
    return imageUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop';
  };
  const getArticleViews = (article: Article): number => article.views || article.visualizacoes || 0;

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1080px] mx-auto px-6 py-16 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-border">
          <div>
            <span className="block font-body text-[13px] font-bold text-ink-muted uppercase tracking-widest mb-2">
              Dashboard
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-2 tracking-tight">
              Meu Espaço
            </h1>
            <p className="font-body text-[15px] text-ink-light">
              Bem-vindo de volta, <span className="text-ink font-medium">{user?.nome || 'Escritor'}</span>. Aqui estão suas estatísticas e publicações.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="inline-flex items-center justify-center w-10 h-10 border border-border text-ink hover:border-ink rounded-full transition-all duration-200 bg-paper-alt"
              title="Configurações"
            >
              <Settings size={18} />
            </Link>
            <Link
              to="/artigos/novo"
              className="inline-flex items-center gap-2 px-6 py-2 h-10 bg-ink hover:bg-ink-light text-white font-body text-[14px] font-medium rounded-full transition-all duration-200"
            >
              <Plus size={16} />
              Escrever
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-10 bg-[#FEF2F2] border-[1.5px] border-[#DC2626] text-[#DC2626] px-6 py-4 rounded-xl">
            <p className="font-body font-bold text-[15px]">Erro ao carregar dados</p>
            <p className="font-body text-[14px] mt-1">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-3 px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-lg text-[13px] font-bold transition-all duration-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-paper-alt border border-border rounded-2xl p-6 skeleton h[100px]" />
            ))
          ) : (
            <>
              <div className="bg-paper-alt border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-body text-[13px] font-bold text-ink-muted uppercase tracking-widest">Publicações</h3>
                  <FileText className="w-5 h-5 text-ink-light" />
                </div>
                <p className="font-display text-4xl font-semibold text-ink">{stats?.totalArticles || 0}</p>
              </div>
              <div className="bg-paper-alt border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-body text-[13px] font-bold text-ink-muted uppercase tracking-widest">Leituras</h3>
                  <Eye className="w-5 h-5 text-ink-light" />
                </div>
                <p className="font-display text-4xl font-semibold text-ink">{stats?.totalViews || 0}</p>
              </div>
              <div className="bg-paper-alt border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-body text-[13px] font-bold text-ink-muted uppercase tracking-widest">Curtidas</h3>
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <p className="font-display text-4xl font-semibold text-ink">{stats?.totalLikes || 0}</p>
              </div>
              <div className="bg-paper-alt border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-body text-[13px] font-bold text-ink-muted uppercase tracking-widest">Comentários</h3>
                  <MessageCircle className="w-5 h-5 text-ink-light" />
                </div>
                <p className="font-display text-4xl font-semibold text-ink">{stats?.totalComments || 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Articles List */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-ink mb-8 border-b border-border pb-4">
              Seus Artigos
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 bg-paper-alt border border-border rounded-2xl">
                <FileText className="w-12 h-12 text-border mx-auto mb-4" />
                <p className="font-body font-medium text-ink mb-2">Nenhum artigo publicado ainda</p>
                <p className="font-body text-[14px] text-ink-light mb-6">Comece a compartilhar suas ideias com o mundo.</p>
                <Link
                  to="/artigos/novo"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-ink text-white font-body text-[14px] font-medium rounded-full hover:bg-ink-light transition-all duration-200"
                >
                  <Plus size={16} />
                  Começar a Escrever
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-border last:border-0 relative"
                  >
                    <Link to={`/artigos/${article.id}`} className="shrink-0">
                      <img
                        src={getArticleImage(article)}
                        alt={getArticleTitle(article)}
                        className="w-full sm:w-[200px] h-[140px] rounded-xl object-cover bg-paper-alt group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0 pr-12 sm:pr-0">
                      <div className="mb-2">
                        <span className="font-body text-[10px] font-bold text-accent uppercase tracking-widest bg-accent-light/10 px-2 py-1 rounded">
                          {getArticleCategory(article)}
                        </span>
                      </div>
                      
                      <Link to={`/artigos/${article.id}`}>
                        <h3 className="font-display text-xl font-bold text-ink mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {getArticleTitle(article)}
                        </h3>
                      </Link>
                      
                      <p className="font-body text-[14px] text-ink-light mb-4 line-clamp-2 leading-relaxed">
                        {getArticleSummary(article)}
                      </p>
                      
                      <div className="flex items-center gap-4 font-body text-[12px] font-medium text-ink-muted">
                        <span>{getArticleDate(article)}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {getArticleViews(article)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="absolute top-0 right-0 sm:static sm:flex flex-col gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <Link
                        to={`/artigos/editar/${article.id}`}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-ink hover:border-ink transition-all duration-200 mb-2 sm:mb-0"
                        title="Editar artigo"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleOpenDeleteModal(article.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-paper-alt border border-border text-ink-muted hover:text-[#DC2626] hover:border-[#DC2626] hover:bg-[#FEF2F2] transition-all duration-200"
                        title="Excluir artigo"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Activity */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-xl font-bold text-ink mb-6 pb-2 border-b border-border">
              Notificações
            </h2>
            
            <div className="bg-paper-alt border border-border rounded-2xl p-6">
              <div className="space-y-6">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full shrink-0 border border-border object-cover bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] text-ink-light mb-[2px] leading-tight">
                        <span className="font-bold text-ink">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        {activity.article && (
                          <span className="font-medium text-ink">"{activity.article}"</span>
                        )}
                      </p>
                      <p className="font-body text-[11px] font-bold text-ink-muted uppercase tracking-wider mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modern Delete Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-paper border border-border rounded-2xl p-8 max-w-[400px] w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] mb-5">
              <Trash size={20} />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-ink mb-2">
              Excluir publicação?
            </h2>
            <p className="font-body text-[15px] text-ink-light mb-8 leading-relaxed">
              Esta ação é permanente e não poderá ser desfeita. O artigo será removido do seu perfil e da plataforma.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="px-6 py-2.5 font-body text-[14px] font-medium text-ink hover:bg-paper-alt border border-border rounded-full transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-body text-[14px] font-medium rounded-full transition-all duration-200 disabled:opacity-50 min-w-[100px]"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Sim, excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}