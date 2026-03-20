import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../lib/api';
import { Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordMismatch = Boolean(confirmPassword && password !== confirmPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validações
    if (!nome || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (nome.length < 3 || nome.length > 100) {
      setError('O nome deve ter entre 3 e 100 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ nome, email, senha: password });
      await login(email, password);
      
      toast.success('Conta criada com sucesso! Bem-vindo(a) ao MindBlog.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-headline text-4xl font-semibold text-on-surface">Join the Network</h1>
        <p className="font-body text-on-surface-variant leading-relaxed">
          Create an account to start publishing your engineering articles and research.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="px-4 py-3 bg-[#ffdad6] text-[#93000a] rounded-lg font-label text-sm flex items-center border border-[#93000a]/20">
            <span className="material-symbols-outlined mr-2">error</span>
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nome" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
              Full Name
            </label>
            <input 
              id="nome" 
              type="text" 
              placeholder="Your name" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
              Work Email
            </label>
            <input 
              id="email" 
              type="email" 
              placeholder="name@company.engineering" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
              Security Key
            </label>
            <div className="relative">
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="min. 6 characters" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pr-10"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: showPassword ? "'FILL' 1" : "'FILL' 0" }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="confirmPassword" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
                Confirm Security Key
              </label>
              {password && !passwordMismatch && (
                <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
              )}
            </div>
            <div className="relative">
              <input 
                id="confirmPassword" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="repeat security key" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`auth-input pr-10 ${passwordMismatch ? '!border-[#93000a] text-[#93000a]' : ''}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            type="submit" 
            disabled={loading || passwordMismatch}
            className="btn-terracotta w-full py-4 rounded-lg font-label font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all flex justify-center items-center h-[56px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Initializing Access...
              </>
            ) : (
              'Initialize Access'
            )}
          </button>
        </div>
      </form>

      <footer className="pt-8 text-center border-t border-outline-variant/10">
        <p className="font-body text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  );
}
