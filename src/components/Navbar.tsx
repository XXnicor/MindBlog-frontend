import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md`}
        style={{
          backgroundColor: 'var(--color-navbar-bg)',
          borderBottom: `1px solid ${isScrolled ? 'var(--color-navbar-border)' : 'transparent'}`
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-20 h-14 md:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-baseline font-display text-[22px] font-semibold tracking-tight text-[var(--color-navbar-text)]">
            MindBlog<span className="text-[var(--color-accent)] ml-[1px] font-bold">.</span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-[14px] transition-fast pb-1 hover:text-[var(--color-navbar-text)] ${
                    isActive 
                      ? 'text-[var(--color-navbar-text)] font-medium border-b-2 border-[var(--color-accent)]' 
                      : 'text-[var(--color-navbar-text-muted)] font-regular hover-underline'
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
                <button
                  onClick={toggleTheme}
                  className="p-2 text-[var(--color-navbar-text)] hover:opacity-70 transition-opacity"
                  title="Alternar tema"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link to="/artigos/novo">
                  <button className="btn-outline text-[14px]">
                    Escrever
                  </button>
                </Link>
                <UserMenu user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-[var(--color-navbar-text)] hover:opacity-70 transition-opacity"
                  title="Alternar tema"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link to="/login" className="text-[14px] text-[var(--color-navbar-text-muted)] transition-fast hover:text-[var(--color-navbar-text)]">
                  Entrar
                </Link>
                <Link to="/register">
                  <button className="btn-primary text-[14px]">
                    Começar
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu & Theme Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleTheme}
                className="text-[var(--color-navbar-text)] hover:opacity-70 transition-opacity p-1"
                title="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                className="text-[var(--color-navbar-text)]"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-[rgba(13,13,13,0.2)] backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[280px] bg-[var(--color-navbar-bg)] shadow-2xl p-6 transition-transform duration-base ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
             <span className="font-display text-[20px] font-semibold text-[var(--color-navbar-text)]">Menu</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--color-navbar-text-muted)] hover:text-[var(--color-navbar-text)] transition-fast p-1 rounded-full">
               <X size={24} />
             </button>
           </div>
 
           <nav className="flex flex-col gap-6">
             {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[18px] transition-fast hover:text-[var(--color-navbar-text)] ${
                  location.pathname === link.path 
                    ? 'text-[var(--color-accent)] font-medium' 
                    : 'text-[var(--color-navbar-text-muted)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-[var(--color-navbar-border)] my-2" />

            {user ? (
              <div className="flex flex-col gap-4">
                <Link to="/artigos/novo" className="text-[16px] text-[var(--color-navbar-text-muted)] hover:text-[var(--color-navbar-text)]">
                   Escrever Novo Artigo
                 </Link>
                 <Link to="/dashboard" className="text-[16px] text-[var(--color-navbar-text-muted)] hover:text-[var(--color-navbar-text)]">
                   Meus Artigos
                 </Link>
                 <Link to="/settings" className="text-[16px] text-[var(--color-navbar-text-muted)] hover:text-[var(--color-navbar-text)]">
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
                 <Link to="/login" className="text-[16px] text-[var(--color-navbar-text-muted)] hover:text-[var(--color-navbar-text)]">
                   Entrar na conta
                 </Link>
                 <Link to="/register" className="mt-2">
                   <button className="btn-primary w-full text-[16px]">
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
