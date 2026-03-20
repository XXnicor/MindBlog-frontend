import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-cyan-500 mb-4">404</h1>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-6"></div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Página não encontrada
          </h2>
          
          <p className="text-slate-400 mb-8">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <Home size={20} />
              Voltar ao Início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-white hover:border-slate-600 rounded-lg transition-colors"
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