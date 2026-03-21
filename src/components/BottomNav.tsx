import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  const tabs = [
    { label: 'Início', icon: 'home', path: '/' },
    { label: 'Explorar', icon: 'explore', path: '/artigos' },
    { label: 'Novo', icon: 'add_circle', path: '/artigos/novo' },
    { label: 'Biblioteca', icon: 'auto_stories', path: '/categorias' },
    { label: 'Perfil', icon: 'person', path: '/dashboard' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-4 bg-surface/85 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.label === 'Home' && location.pathname === '/');
        return (
          <Link 
            key={tab.label}
            to={tab.path} 
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 mb-2 transition-all ${
              isActive 
                ? 'text-primary font-bold bg-primary/10' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span className="font-headline text-[10px] uppercase tracking-widest mt-1">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
