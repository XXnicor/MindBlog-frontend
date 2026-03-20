import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Preencha todos os campos');
      }
      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper-alt)] text-[var(--color-ink)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl text-[var(--color-ink)] mb-3 tracking-tight">MindBlog<span className="text-[var(--color-accent)]">.</span></h1>
            <p className="font-body text-[15px] text-[var(--color-ink-light)]">Acesse sua conta para continuar lendo e publicando.</p>
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
                <div className="flex items-center justify-between mb-[6px]">
                  <label htmlFor="password" className="form-label block">
                    Senha
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-8 text-center font-body text-[14px] text-[var(--color-ink-light)] border-t border-[var(--color-border)] pt-6">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-[var(--color-ink)] font-medium hover:text-[var(--color-accent)] transition-colors hover-underline pb-1">
                Criar conta
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
