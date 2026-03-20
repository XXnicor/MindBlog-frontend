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
    let cancelled = false;

    async function load() {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      try {
        const [articlesData, statsData] = await Promise.all([
          articleService.getMyArticles(1, 50),
          userService.getStats()
        ]);
        
        if (!cancelled) {
          setArticles(articlesData.articles || []);
          setStats(statsData || null);
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados do dashboard:', err);
        if (!cancelled) setError(err.message || 'Erro ao carregar dados');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
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
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1080px] mx-auto px-6 py-16 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-outline-variant/30">
          <div>
            <span className="block font-label text-[13px] font-bold text-secondary uppercase tracking-widest mb-2">
              Dashboard
            </span>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-2 tracking-tight">
              Meu Espaço
            </h1>
            <p className="font-body text-[15px] text-on-surface-variant">
              Bem-vindo de volta, <span className="text-on-surface font-medium">{user?.nome || 'Escritor'}</span>. Aqui estão suas estatísticas e publicações.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="inline-flex items-center justify-center w-10 h-10 border border-outline-variant/30 text-on-surface hover:border-primary rounded-full transition-all duration-200 bg-surface-container-low"
              title="Configurações"
            >
              <Settings size={18} />
            </Link>
            <Link
              to="/artigos/novo"
              className="inline-flex items-center gap-2 px-6 py-2 h-10 bg-primary hover:bg-primary-container text-on-primary font-label text-[14px] font-bold rounded-full transition-all duration-200 uppercase tracking-widest"
            >
              <Plus size={16} />
              Escrever
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-10 bg-error/10 border-[1.5px] border-error text-error px-6 py-4 rounded-xl">
            <p className="font-body font-bold text-[15px]">Erro ao carregar dados</p>
            <p className="font-body text-[14px] mt-1">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-3 px-4 py-2 border border-error text-error hover:bg-error hover:text-white rounded-lg text-[13px] font-bold transition-all duration-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 h-[100px] animate-pulse" />
            ))
          ) : (
            <>
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-label text-[13px] font-bold text-secondary uppercase tracking-widest">Publicações</h3>
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <p className="font-headline text-4xl font-semibold text-on-surface">{stats?.totalArticles || 0}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-label text-[13px] font-bold text-secondary uppercase tracking-widest">Leituras</h3>
                  <Eye className="w-5 h-5 text-secondary" />
                </div>
                <p className="font-headline text-4xl font-semibold text-on-surface">{stats?.totalViews || 0}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-label text-[13px] font-bold text-secondary uppercase tracking-widest">Curtidas</h3>
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <p className="font-headline text-4xl font-semibold text-on-surface">{stats?.totalLikes || 0}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-label text-[13px] font-bold text-secondary uppercase tracking-widest">Comentários</h3>
                  <MessageCircle className="w-5 h-5 text-secondary" />
                </div>
                <p className="font-headline text-4xl font-semibold text-on-surface">{stats?.totalComments || 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Articles List */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-8 border-b border-outline-variant/30 pb-4">
              Seus Artigos
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-low border border-outline-variant/10 rounded-2xl">
                <FileText className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                <p className="font-body font-medium text-on-surface mb-2">Nenhum artigo publicado ainda</p>
                <p className="font-body text-[14px] text-secondary mb-6">Comece a compartilhar suas ideias com o mundo.</p>
                <Link
                  to="/artigos/novo"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-on-primary font-label text-[14px] font-bold rounded-full hover:bg-primary-container transition-all duration-200 uppercase tracking-widest"
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
                    className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-outline-variant/20 last:border-0 relative"
                  >
                     <Link to={`/artigo/${article.id}`} className="shrink-0">
                      <div className="w-full sm:w-[200px] h-[140px] rounded-xl overflow-hidden bg-surface-container-low relative">
                        <img
                          src={getArticleImage(article)}
                          alt={getArticleTitle(article)}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.removeAttribute('hidden');
                          }}
                        />
                        <div className="absolute inset-0 hidden flex items-center justify-center text-primary/20">
                          <span className="material-symbols-outlined text-4xl">article</span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0 pr-12 sm:pr-0">
                      <div className="mb-2">
                        <span className="font-label text-[10px] font-bold text-tertiary uppercase tracking-widest bg-surface-container px-2 py-1 rounded">
                          {getArticleCategory(article)}
                        </span>
                      </div>
                      
                      <Link to={`/artigo/${article.id}`}>
                        <h3 className="font-headline text-xl font-bold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {getArticleTitle(article)}
                        </h3>
                      </Link>
                      
                      <p className="font-body text-[14px] text-secondary mb-4 line-clamp-2 leading-relaxed">
                        {getArticleSummary(article)}
                      </p>
                      
                      <div className="flex items-center gap-4 font-label text-[12px] font-bold text-secondary uppercase tracking-widest">
                        <span>{getArticleDate(article)}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
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
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low border border-outline-variant/20 text-secondary hover:text-primary hover:border-primary transition-all duration-200 mb-2 sm:mb-0"
                        title="Editar artigo"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleOpenDeleteModal(article.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low border border-outline-variant/20 text-secondary hover:text-error hover:border-error hover:bg-error/5 transition-all duration-200"
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
            <h2 className="font-headline text-xl font-bold text-on-surface mb-6 pb-2 border-b border-outline-variant/30">
              Notificações
            </h2>
            
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6">
              <div className="space-y-6">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-10 h-10 rounded-full shrink-0 border border-outline-variant/20 object-cover bg-surface"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] text-secondary mb-[2px] leading-tight">
                        <span className="font-bold text-on-surface">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        {activity.article && (
                          <span className="font-medium text-on-surface">"{activity.article}"</span>
                        )}
                      </p>
                      <p className="font-label text-[11px] font-bold text-secondary uppercase tracking-wider mt-1">
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
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="bg-surface border border-outline-variant rounded-2xl p-8 max-w-[400px] w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-5">
              <Trash size={20} />
            </div>
            
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
              Excluir publicação?
            </h2>
            <p className="font-body text-[15px] text-secondary mb-8 leading-relaxed">
              Esta ação é permanente e não poderá ser desfeita. O artigo será removido do seu perfil e da plataforma.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="px-6 py-2.5 font-body text-[14px] font-medium text-on-surface hover:bg-surface-container-low border border-outline-variant rounded-full transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 flex items-center justify-center gap-2 bg-error hover:bg-error/80 text-on-primary font-body text-[14px] font-medium rounded-full transition-all duration-200 disabled:opacity-50 min-w-[100px]"
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