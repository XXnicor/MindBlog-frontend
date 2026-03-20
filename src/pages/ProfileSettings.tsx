import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService, userService } from '../lib/api';
import { getImageUrl } from '../lib/imageUtils';
import { User, Stats } from '../types/article';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [createdAt, setCreatedAt] = useState('');

  const maxBioLength = 500;
  const bioLength = bio.length;

  useEffect(() => {
    loadUserData();
    loadUserStats();
  }, []);

  // Cleanup da URL do preview para evitar memory leak
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      const user = await authService.getCurrentUser();
      setNome(user.nome);
      setEmail(user.email);
      setBio(user.bio || '');
      
      // Adicionar timestamp para forçar atualização da imagem
      if (user.avatar) {
        const avatarUrl = user.avatar.includes('?') 
          ? `${user.avatar}&t=${Date.now()}` 
          : `${user.avatar}?t=${Date.now()}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview('');
      }
      
      setCreatedAt(user.createdAt);
    } catch (error: any) {
      console.error('Erro ao carregar dados do usuário:', error);
      if (error.message.includes('token') || error.message.includes('autenticação')) {
        alert('Sessão expirada. Faça login novamente.');
        navigate('/login');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const userStats = await userService.getStats();
      setStats(userStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamanho do arquivo (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setAvatarFile(file);
      
      // Gerar preview imediato usando URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (nome.length < 3 || nome.length > 100) {
        throw new Error('O nome deve ter entre 3 e 100 caracteres');
      }

      if (bio.length > 500) {
        throw new Error('A bio deve ter no máximo 500 caracteres');
      }

      if (senha && senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);
      
      if (senha) {
        formData.append('senha', senha);
      }
      
      if (bio) {
        formData.append('bio', bio);
      }
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await userService.updateProfile(formData);
      
      alert('Dados atualizados! ✅');
      
      // Limpar campos temporários
      setSenha(''); 
      
      // Revogar URL blob antes de limpar
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
      
      setAvatarFile(null);
      setAvatarPreview(''); // Limpar preview para forçar atualização
      
      // Recarregar dados do servidor
      await loadUserData();
      
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      alert(error.message || 'Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Preview do avatar com fallback
  const getAvatarPreview = () => {
    if (avatarPreview) {
      // Se é uma URL local (blob: ou data:)
      if (avatarPreview.startsWith('blob:') || avatarPreview.startsWith('data:')) {
        return avatarPreview;
      }
      // Se é uma URL completa do servidor
      if (avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://')) {
        return avatarPreview;
      }
      const imageUrl = getImageUrl(avatarPreview);
      if (imageUrl) {
        return imageUrl;
      }
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&size=200&background=06b6d4&color=fff`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Navegação Auxiliar */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Configurações do Perfil
          </h1>
          <p className="text-slate-400">
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seção de Avatar */}
            <div className="flex flex-col items-center pb-8 border-b border-slate-800">
              <div className="relative group mb-4">
                <img
                   src={getAvatarPreview()}
                   alt="Avatar"
                   className="w-24 h-24 rounded-full object-cover border-4 border-slate-700"
                   onError={(e) => {
                     e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&size=200&background=06b6d4&color=fff`;
                   }}
                />
                <label
                  htmlFor="avatarFile"
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                  id="avatarFile"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <p className="text-sm text-slate-400 text-center max-w-sm">
                Clique na imagem para alterar seu avatar. Formatos aceitos: JPG, PNG, GIF, WEBP (máx 5MB)
              </p>
            </div>

            {/* Campos do Formulário */}
            <div className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Nova Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                  Nova Senha (opcional)
                </label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Deixe em branco para manter a senha atual"
                  minLength={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {senha && (
                  <p className="mt-1 text-xs text-slate-500">
                    Mínimo de 6 caracteres
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, maxBioLength))}
                  rows={5}
                  placeholder="Conte um pouco sobre você..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-slate-500">
                    Compartilhe sua experiência e interesses
                  </p>
                  <p className={`text-xs ${bioLength >= maxBioLength ? 'text-red-400' : 'text-slate-500'}`}>
                    {bioLength}/{maxBioLength}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da Conta */}
            <div className="pt-8 border-t border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Informações da conta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Membro desde</p>
                  <p className="text-slate-300 font-medium">{formatDate(createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Estatísticas do Usuário */}
            {stats && (
              <div className="pt-8 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-lg font-semibold text-white">
                    Suas Estatísticas
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Artigos</p>
                    <p className="text-2xl font-bold text-white">{stats.totalArticles || 0}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Visualizações</p>
                    <p className="text-2xl font-bold text-cyan-400">{stats.totalViews || 0}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Curtidas</p>
                    <p className="text-2xl font-bold text-pink-400">{stats.totalLikes || 0}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-1">Comentários</p>
                    <p className="text-2xl font-bold text-green-400">{stats.totalComments || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Salvar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </form>
        </div>

        {/* Zona de Perigo (Opcional) */}
        <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Zona de Perigo
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Ações irreversíveis que afetam sua conta permanentemente
          </p>
          <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">
            Desativar Conta
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
