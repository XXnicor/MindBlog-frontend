import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validação de campos
      if (!nome || !email || !senha || !confirmarSenha) {
        throw new Error('Preencha todos os campos');
      }

      // Validação de nome
      if (nome.length < 3 || nome.length > 100) {
        throw new Error('O nome deve ter entre 3 e 100 caracteres');
      }

      // Validação de senha
      if (senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Validação de confirmação de senha
      if (senha !== confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      // Chamar API de registro
      await authService.register({ nome, email, senha });
      
      // Fazer login automático após cadastro
      await login(email, senha);

      // Sucesso
      alert('Conta criada com sucesso! 🎉');
      navigate('/login');

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-white mb-6 font-mono">&lt;M/&gt;</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Crie sua Conta
            </h2>
            <p className="text-slate-400">
              Preencha seus dados para começar a escrever
            </p>
          </div>

          {/* Card de Cadastro */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            {/* Mensagem de Erro */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Nome Completo */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Campo Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-slate-950 border rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    confirmarSenha && senha !== confirmarSenha
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:border-cyan-500'
                  }`}
                />
                {confirmarSenha && senha !== confirmarSenha && (
                  <p className="mt-1 text-xs text-red-500">
                    As senhas não coincidem
                  </p>
                )}
              </div>

              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Criar conta
                  </>
                )}
              </button>
            </form>

            {/* Rodapé do Card */}
            <div className="mt-6 text-center text-sm text-slate-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
              >
                Fazer login
              </Link>
            </div>
          </div>

          {/* Link Alternativo */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Voltar para a Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
