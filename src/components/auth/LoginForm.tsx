import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Bem-vindo de volta!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message ?? 'Email ou senha incorretos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="font-headline text-4xl font-semibold text-on-surface">Welcome back</h1>
        <p className="font-body text-on-surface-variant leading-relaxed">
          Access your technical dashboard and engineering research journals.
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
            <label htmlFor="email" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
              Work Email
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="name@company.engineering" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-label text-xs uppercase tracking-widest text-on-surface-variant block font-bold">
                Security Key
              </label>
              <a href="#" className="font-label text-[10px] uppercase tracking-wider text-primary hover:text-primary-container transition-colors">
                Forgot Access?
              </a>
            </div>
            <div className="relative">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                required
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
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="remember" 
            name="remember" 
            className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 bg-transparent"
          />
          <label htmlFor="remember" className="font-label text-xs text-on-surface-variant cursor-pointer">
            Persistent Session
          </label>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-terracotta w-full py-4 rounded-lg font-label font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all flex justify-center items-center h-[56px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              'Initialize Login'
            )}
          </button>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-outline-variant/20"></div>
            <span className="flex-shrink mx-4 font-mono text-[10px] text-on-secondary-container uppercase tracking-tighter">
              Identity Provider
            </span>
            <div className="flex-grow border-t border-outline-variant/20"></div>
          </div>

          <button 
            type="button" 
            className="w-full flex items-center justify-center space-x-3 bg-surface-container-highest text-on-surface py-3 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors font-label font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>SSO / GitHub Auth</span>
          </button>
        </div>
      </form>

      <footer className="pt-8 text-center border-t border-outline-variant/10">
        <p className="font-body text-sm text-on-surface-variant">
          New to the network?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
            Join the Network
          </Link>
        </p>
      </footer>
    </div>
  );
}
