import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { articleService, commentService, authService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';

interface Comment {
  id: number;
  text: string;
  autor: {
    id: number;
    nome: string;
    avatar?: string;
  };
  createdAt: string;
}

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
    loadComments();
    loadCurrentUser();
  }, [articleId]);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      // Usuário não está logado
      console.log('Usuário não autenticado');
    }
  };

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
    
    return date.toLocaleDateString('pt-BR');
  };

  const getAvatarUrl = (avatar?: string) => getImageUrl(avatar) || null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-cyan-500" />
        <h3 className="text-2xl font-bold text-white">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Formulário de novo comentário */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="Escreva seu comentário..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-400">
              {newComment.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Comentar'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-950 border border-slate-700 rounded-lg text-center">
          <p className="text-slate-400">
            <a href="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
              Faça login
            </a>
            {' '}para comentar
          </p>
        </div>
      )}

      {/* Lista de comentários */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-slate-400">Carregando comentários...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadComments}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum comentário ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-4"
            >
              {/* Header do comentário */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {getAvatarUrl(comment.autor.avatar) ? (
                    <img
                      src={getAvatarUrl(comment.autor.avatar)!}
                      alt={comment.autor.nome}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.autor.nome)}&size=40&background=06b6d4&color=fff`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold">
                      {comment.autor.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-white">{comment.autor.nome}</p>
                    <p className="text-sm text-slate-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Botão de deletar (apenas para o autor ou admin) */}
                {currentUser && currentUser.id === comment.autor.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Deletar comentário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Texto do comentário */}
              <p className="text-slate-300 whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
