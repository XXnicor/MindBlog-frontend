import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ServerError() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Erro Interno do Servidor
          </h2>
          
          <p className="text-slate-400 mb-8">
            Ocorreu um erro inesperado no servidor. Estamos trabalhando para resolver o problema.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors"
            >
              <RefreshCw size={20} />
              Tentar novamente
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-white hover:border-slate-600 rounded-lg transition-colors"
            >
              <Home size={20} />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}