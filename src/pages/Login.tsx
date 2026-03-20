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

  const inputClasses = "w-full h-12 bg-paper-alt border-[1.5px] border-border rounded-lg px-4 font-body text-[15px] text-ink placeholder:text-ink-muted focus:bg-paper focus:border-ink focus:ring-[3px] focus:ring-ink/10 outline-none transition-all duration-200";
  const labelClasses = "block font-body text-[13px] font-medium text-ink-light mb-[6px]";
  const buttonClasses = "w-full h-12 bg-ink text-paper font-body text-[15px] font-medium rounded-lg hover:bg-[#2D2D2D] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-paper-alt text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl text-ink mb-3 tracking-tight">MindBlog<span className="text-accent">.</span></h1>
            <p className="font-body text-[15px] text-ink-light">Acesse sua conta para continuar lendo e publicando.</p>
          </div>

          {/* Form Card */}
          <div className="bg-paper border border-border rounded-2xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {error && (
              <div className="mb-6 bg-[#FEF2F2] border-[1.5px] border-[#DC2626] text-[#DC2626] px-4 py-3 rounded-lg font-body text-[14px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  className={inputClasses}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-[6px]">
                  <label htmlFor="password" className="block font-body text-[13px] font-medium text-ink-light">
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
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 ${buttonClasses}`}
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

            <div className="mt-8 text-center font-body text-[14px] text-ink-light border-t border-border pt-6">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-ink font-medium hover:text-accent transition-colors hover-underline pb-1">
                Criar conta
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-[14px] text-ink-muted hover:text-ink transition-colors font-medium">
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
