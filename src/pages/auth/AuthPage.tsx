import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return null; // or a tiny spinner

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-surface">
      <AuthLeftPanel />
      
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md space-y-12 relative z-10">
          {/* Mobile Header (Visible only on small screens) */}
          <div className="md:hidden mb-8">
            <span className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              MindBlog<span className="text-primary">.</span>
            </span>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </section>
    </main>
  );
}
