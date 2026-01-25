import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Moon } from 'lucide-react'
import UserMenu from './UserMenu'

export default function Navbar(){
  // Simula usuário logado (substituir com contexto de autenticação real)
  //const [user] = useState<{name: string; email: string; avatar?: string} | null>(null);
  //Para testar o menu, descomente a linha abaixo:
   const [user] = useState({ name: 'João Silva', email: 'joao@email.com' });

  const handleSignOut = () => {
    console.log('Logout realizado');
    // TODO: Implementar lógica de logout com contexto de autenticação
  };

  return (
    <header className="bg-transparent border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg">&lt;M/&gt;</Link>

        <nav className="hidden md:flex gap-8 text-slate-200">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/artigos" className="hover:text-white">Artigos</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="toggle-theme" className="text-slate-300 hover:text-white">
            <Moon size={18} />
          </button>
          
          {user ? (
            // Menu do usuário logado
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            // Botões de login/cadastro para usuários não logados
            <>
              <Link to="/login" className="text-slate-300 hover:text-white">Entrar</Link>
              <Link to="/register">
                <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-3 py-1 rounded-md font-medium">
                  Cadastrar
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
