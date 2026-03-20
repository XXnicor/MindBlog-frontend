import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  const tabs = [
    { label: 'Home', icon: 'home', path: '/' },
    { label: 'Explore', icon: 'explore', path: '/artigos' },
    { label: 'New', icon: 'add_circle', path: '/artigos/novo' },
    { label: 'Library', icon: 'auto_stories', path: '/categorias' },
    { label: 'Profile', icon: 'person', path: '/dashboard' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-4 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-xl border-t border-stone-200/20 dark:border-stone-800/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.label === 'Home' && location.pathname === '/');
        return (
          <Link 
            key={tab.label}
            to={tab.path} 
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 mb-2 transition-all ${
              isActive 
                ? 'text-orange-700 dark:text-orange-500 font-bold bg-orange-50/50 dark:bg-orange-900/20' 
                : 'text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400'
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
