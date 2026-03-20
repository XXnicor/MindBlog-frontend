import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-9xl font-display font-bold text-[var(--color-accent)] mb-4">404</h1>
            <div className="w-24 h-1 bg-[var(--color-accent)] mx-auto mb-6"></div>
          </div>

          <h2 className="text-3xl font-display font-bold text-[var(--color-ink)] mb-4">
            Página não encontrada
          </h2>
          
          <p className="text-[var(--color-ink-light)] mb-8">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Voltar ao Início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)] inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}