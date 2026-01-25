import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock Data - Dados iniciais do usuário
const MOCK_USER = {
  nome: 'John Doe',
  email: 'john.doe@email.com',
  bio: 'Desenvolvedor Full Stack apaixonado por tecnologia e inovação. Compartilho conhecimento sobre React, Node.js e boas práticas de programação.',
  avatarUrl: 'https://i.pravatar.cc/300?img=12',
  tipoContá: 'Premium',
  membroDesde: '20 jan 2025'
};

export default function ProfileSettings() {
  const [nome, setNome] = useState(MOCK_USER.nome);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [bio, setBio] = useState(MOCK_USER.bio);
  const [avatarUrl, setAvatarUrl] = useState(MOCK_USER.avatarUrl);
  const [loading, setLoading] = useState(false);

  const maxBioLength = 500;
  const bioLength = bio.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulação de salvamento (substituir com chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Dados atualizados! ✅');
      
      // TODO: Integrar com API
      // await api.put('/users/me', { nome, email, bio, avatarUrl });
      
    } catch (error) {
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Preview do avatar com fallback
  const getAvatarPreview = () => {
    if (!avatarUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&size=200&background=06b6d4&color=fff`;
    }
    return avatarUrl;
  };

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
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="w-full max-w-md">
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-300 mb-2">
                  Foto de Perfil
                </label>
                <input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Adicione uma imagem ou deixe em branco para usar o avatar padrão
                </p>
              </div>
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
                  <p className="text-sm text-slate-500 mb-1">Tipo de conta</p>
                  <p className="text-slate-300 font-medium flex items-center gap-2">
                    {MOCK_USER.tipoContá}
                    <span className="inline-block bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">
                      Ativo
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Membro desde</p>
                  <p className="text-slate-300 font-medium">{MOCK_USER.membroDesde}</p>
                </div>
              </div>
            </div>

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
