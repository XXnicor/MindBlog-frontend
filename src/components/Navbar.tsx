import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Explorar', path: '/artigos' },
    { name: 'Categorias', path: '/categorias' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-paper/80 ${
          isScrolled ? 'border-b border-border' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-20 h-14 md:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-baseline font-display text-[22px] font-semibold text-ink tracking-tight">
            MindBlog<span className="text-accent ml-[1px] font-bold">.</span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[14px] transition-fast pb-1 ${
                    isActive 
                      ? 'text-ink font-medium border-b-2 border-accent' 
                      : 'text-ink-light font-regular hover:text-ink hover-underline'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side logic */}
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/artigos/novo">
                  <button className="border border-accent text-accent px-4 py-[6px] rounded-md text-[14px] font-medium transition-fast hover:bg-accent hover:text-white active:scale-95">
                    Escrever
                  </button>
                </Link>
                <UserMenu user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-[14px] text-ink-light transition-fast hover:text-ink">
                  Entrar
                </Link>
                <Link to="/register">
                  <button className="bg-accent hover:bg-accent-hover text-white px-[20px] py-[8px] rounded-md text-[14px] font-medium transition-fast active:scale-95 shadow-sm">
                    Começar
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-ink"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[280px] bg-paper shadow-2xl p-6 transition-transform duration-base ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="font-display text-[20px] font-semibold text-ink">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-ink-light hover:text-ink transition-fast p-1 rounded-full">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[18px] transition-fast ${
                  location.pathname === link.path 
                    ? 'text-accent font-medium' 
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-border my-2" />

            {user ? (
              <div className="flex flex-col gap-4">
                <Link to="/artigos/novo" className="text-[16px] text-ink-light hover:text-ink">
                  Escrever Novo Artigo
                </Link>
                <Link to="/dashboard" className="text-[16px] text-ink-light hover:text-ink">
                  Meus Artigos
                </Link>
                <Link to="/settings" className="text-[16px] text-ink-light hover:text-ink">
                  Configurações
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-left text-[16px] text-red-600 font-medium hover:text-red-700"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-[16px] text-ink-light hover:text-ink">
                  Entrar na conta
                </Link>
                <Link to="/register">
                  <button className="w-full bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-md text-[16px] font-medium transition-fast shadow-sm mt-2">
                    Começar a escrever
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
