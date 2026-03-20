import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
      if (!nome || !email || !senha || !confirmarSenha) throw new Error('Preencha todos os campos');
      if (nome.length < 3 || nome.length > 100) throw new Error('O nome deve ter entre 3 e 100 caracteres');
      if (senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');
      if (senha !== confirmarSenha) throw new Error('As senhas não coincidem');
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) throw new Error('Email inválido');

      await authService.register({ nome, email, senha });
      await login(email, senha);

      toast.success('Conta criada com sucesso! Bem-vindo(a) ao MindBlog.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch = Boolean(confirmarSenha && senha !== confirmarSenha);

  return (
    <div className="min-h-screen bg-[var(--color-paper-alt)] text-[var(--color-ink)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl text-[var(--color-ink)] mb-3 tracking-tight">Junte-se a nós<span className="text-[var(--color-accent)]">.</span></h1>
            <p className="font-body text-[15px] text-[var(--color-ink-light)]">Crie sua conta para começar a publicar.</p>
          </div>

          {/* Form Card */}
          <div className="bg-[var(--color-paper-raised)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {error && (
              <div className="mb-6 form-error-message p-3 bg-[#FEF2F2] border border-[var(--color-error)] rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nome" className="form-label block mb-[6px]">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label block mb-[6px]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="senha" className="form-label block mb-[6px]">
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
                  className="form-input w-full"
                />
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="form-label block mb-[6px]">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`form-input w-full ${passwordMismatch ? '!border-[var(--color-error)] !bg-[#FEF2F2] focus:!ring-[var(--color-error)]' : ''}`}
                />
                {passwordMismatch && (
                  <p className="form-error-message">
                    As senhas não coincidem
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordMismatch}
                className="btn-primary w-full mt-2 h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

          <div className="mt-8 text-center font-body text-[14px] text-[var(--color-ink-light)] border-t border-[var(--color-border)] pt-6">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent)] transition-colors hover-underline pb-1">
                Fazer login
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-[14px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors font-medium">
              <ArrowLeft size={16} />
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
