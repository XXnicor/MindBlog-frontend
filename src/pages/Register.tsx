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

  const inputClasses = "w-full h-12 bg-paper-alt border-[1.5px] border-border rounded-lg px-4 font-body text-[15px] text-ink placeholder:text-ink-muted focus:bg-paper focus:border-ink focus:ring-[3px] focus:ring-ink/10 outline-none transition-all duration-200";
  const inputErrorClasses = "w-full h-12 bg-[#FEF2F2] border-[1.5px] border-[#DC2626] rounded-lg px-4 font-body text-[15px] text-ink placeholder:text-[#DC2626]/60 focus:bg-white focus:border-[#DC2626] focus:ring-[3px] focus:ring-[#DC2626]/20 outline-none transition-all duration-200";
  const labelClasses = "block font-body text-[13px] font-medium text-ink-light mb-[6px]";
  const buttonClasses = "w-full h-12 bg-ink text-paper font-body text-[15px] font-medium rounded-lg hover:bg-[#2D2D2D] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const passwordMismatch = Boolean(confirmarSenha && senha !== confirmarSenha);

  return (
    <div className="min-h-screen bg-paper-alt text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl text-ink mb-3 tracking-tight">Junte-se a nós<span className="text-accent">.</span></h1>
            <p className="font-body text-[15px] text-ink-light">Crie sua conta para começar a publicar.</p>
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
                <label htmlFor="nome" className={labelClasses}>
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="John Doe"
                  required
                  className={inputClasses}
                />
              </div>

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
                <label htmlFor="senha" className={labelClasses}>
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
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="confirmarSenha" className={labelClasses}>
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={passwordMismatch ? inputErrorClasses : inputClasses}
                />
                {passwordMismatch && (
                  <p className="mt-2 text-[12px] text-[#DC2626] font-body font-medium">
                    As senhas não coincidem
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordMismatch}
                className={`mt-2 ${buttonClasses}`}
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

            <div className="mt-8 text-center font-body text-[14px] text-ink-light border-t border-border pt-6">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-ink font-medium hover:text-accent transition-colors hover-underline pb-1">
                Fazer login
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
