import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Loader2, Send } from 'lucide-react';
import { articleService, commentService, authService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';
import { Comment } from '../types/article';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState('');

  const MAX_COMMENT_LENGTH = 1000;

  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      if (!cancelled) {
        setLoading(true);
        setError('');
      }

      try {
        const data = await articleService.getComments(articleId);
        if (!cancelled) setComments(data);
      } catch (err: any) {
        console.error('Erro ao carregar comentários:', err);
        if (!cancelled) setError('Erro ao carregar comentários');
      } finally {
        if (!cancelled) setLoading(false);
      }

      try {
        const user = await authService.getCurrentUser();
        if (!cancelled) setCurrentUser(user);
      } catch (err) {
        console.log('Usuário não autenticado');
      }
    }
    
    load();
    return () => { cancelled = true; };
  }, [articleId]);

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await articleService.getComments(articleId);
      setComments(data);
    } catch (err: any) {
      console.error('Erro ao carregar comentários:', err);
      setError('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    if (newComment.length > MAX_COMMENT_LENGTH) {
      alert(`O comentário deve ter no máximo ${MAX_COMMENT_LENGTH} caracteres`);
      return;
    }

    setSubmitting(true);
    try {
      await articleService.createComment(articleId, newComment);
      setNewComment('');
      await loadComments();
    } catch (err: any) {
      console.error('Erro ao criar comentário:', err);
      alert(err.message || 'Erro ao criar comentário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) {
      return;
    }

    try {
      await commentService.delete(commentId.toString());
      await loadComments();
    } catch (err: any) {
      console.error('Erro ao deletar comentário:', err);
      alert(err.message || 'Erro ao deletar comentário.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? 'agora mesmo' : `há ${minutes} minutos`;
      }
      return hours === 1 ? 'há 1 hora' : `há ${hours} horas`;
    }
    
    if (days === 1) return 'ontem';
    if (days < 7) return `há ${days} dias`;
    
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getAvatarUrl = (avatar?: string) => getImageUrl(avatar) || null;

  return (
    <div className="pt-16 pb-12 mt-16 border-t border-outline-variant">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-10">
        <h3 className="font-headline text-3xl font-bold text-on-surface flex items-center gap-3 tracking-tight">
          Discussão <span className="text-secondary text-xl font-body font-normal">({comments.length})</span>
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-14">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
              placeholder="Adicione um comentário à discussão..."
              rows={4}
              className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface placeholder-secondary focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-all resize-none font-body text-[16px] leading-relaxed"
              required
            />
            <div className="absolute right-4 bottom-4 flex items-center gap-4">
              <span className={`text-[12px] font-medium font-body ${newComment.length >= MAX_COMMENT_LENGTH * 0.9 ? 'text-error' : 'text-secondary'}`}>
                {newComment.length}/{MAX_COMMENT_LENGTH}
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="w-10 h-10 rounded-full bg-on-surface text-on-primary flex items-center justify-center hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Enviar comentário"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 ml-[-2px] mt-[2px]" />
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-14 p-8 bg-surface-container-low border border-outline-variant rounded-xl text-center">
          <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
          <p className="font-body text-[15px] text-secondary">
            <a href="/login" className="text-on-surface font-bold hover:text-primary underline decoration-outline-variant underline-offset-4 transition-colors">
              Identifique-se
            </a>
            {' '}para participar da discussão.
          </p>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-secondary mb-3" />
          <p className="font-body text-[14px] text-secondary">Carregando comentários...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-error/10 border border-error rounded-xl text-error">
          <p className="font-body text-[15px] font-bold mb-3">{error}</p>
          <button
            onClick={loadComments}
            className="px-6 py-2 border border-error hover:bg-error hover:text-on-primary font-body text-[13px] font-bold rounded-full transition-colors uppercase tracking-widest"
          >
            Tentar novamente
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-headline text-xl text-secondary italic">Seja o primeiro a compartilhar seus pensamentos.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group pb-10 border-b border-outline-variant last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {comment.autor?.avatar ? (
                    <img
                      src={getAvatarUrl(comment.autor.avatar)!}
                      alt={comment.autor.nome || 'Usuário'}
                      className="w-12 h-12 rounded-full object-cover bg-surface-container-low"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.autor?.nome || 'U')}&size=48&background=random&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface font-bold font-headline text-lg">
                      {comment.autor?.nome?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}

                  <div>
                    <p className="font-body font-bold text-[15px] text-on-surface mb-[2px]">
                      {comment.autor?.nome || 'Usuário'}
                    </p>
                    <p className="font-body text-[13px] text-secondary">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>

                {currentUser && comment.autor && currentUser.id === comment.autor.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                    title="Remover comentário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="font-body text-[15px] text-on-surface leading-relaxed whitespace-pre-wrap ml-16">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
