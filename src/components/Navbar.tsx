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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI', path: '/ai' },
    { name: 'Engineering', path: '/artigos' },
    { name: 'Architecture', path: '/categorias' }
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-surface/85 dark:bg-inverse-surface/85 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center font-headline text-on-surface antialiased">
          
          {/* ESQUERDA */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="text-2xl font-bold tracking-tight text-on-surface after:content-['.'] after:text-primary-container"
            >
              MindBlog
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.name === 'Home' && location.pathname === '/');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`transition-all duration-300 pb-1 font-semibold ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* DIREITA */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block p-2 text-secondary hover:bg-surface-container-low/50 transition-all duration-300 scale-95 active:scale-90 rounded-full">
              <span className="material-symbols-outlined block">search</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="hidden md:block p-2 text-secondary hover:bg-surface-container-low/50 transition-all duration-300 scale-95 active:scale-90 rounded-full"
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-4 ml-2">
                <Link to="/artigos/novo" className="font-label text-sm font-bold text-primary border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors">
                  Write
                </Link>
                <UserMenu user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 ml-2">
                <Link to="/login" className="font-label text-sm font-medium text-secondary hover:text-on-surface transition-colors">
                  Sign In
                </Link>
                <Link to="/register">
                  <button className="bg-primary hover:bg-primary-container text-on-primary px-5 py-2 rounded-lg font-label text-sm font-bold tracking-wide transition-all duration-300 scale-95 active:scale-90 shadow-sm">
                    Join Network
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Icon */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleTheme}
                className="text-secondary hover:bg-surface-container-low/50 p-2 rounded-full transition-colors"
                title="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                className="text-on-surface p-1"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[280px] bg-surface shadow-2xl p-6 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="font-headline text-xl font-bold text-on-surface">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-on-surface transition-colors p-1 rounded-full">
              <X size={24} />
            </button>
          </div>
 
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-headline text-lg transition-colors ${
                  location.pathname === link.path 
                    ? 'text-primary font-bold' 
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-outline-variant my-2" />

            {user ? (
              <div className="flex flex-col gap-4">
                <Link to="/artigos/novo" className="font-label text-base text-secondary hover:text-primary transition-colors">
                  Write New Article
                </Link>
                <Link to="/dashboard" className="font-label text-base text-secondary hover:text-primary transition-colors">
                  My Articles
                </Link>
                <Link to="/settings" className="font-label text-base text-secondary hover:text-primary transition-colors">
                  Settings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-left font-label text-base text-error font-bold hover:text-error transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="font-label text-base text-secondary hover:text-on-surface transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="mt-2">
                  <button className="bg-primary w-full text-on-primary px-5 py-3 rounded-lg font-label text-sm font-bold tracking-wide hover:bg-primary-container transition-colors shadow-sm">
                    Join Network
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
