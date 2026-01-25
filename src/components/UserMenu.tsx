import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSignOut?: () => void;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Detecta clique fora do menu para fechá-lo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    if (onSignOut) {
      onSignOut();
    }
    // Redireciona para home após logout
    navigate('/');
  };

  // Avatar padrão caso não tenha imagem
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=06b6d4&color=fff`;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger - Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="Menu do usuário"
      >
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-slate-700 object-cover"
        />
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header - Informações do Usuário */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user.name}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </Link>

            {/* Configurações */}
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Configurações</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-slate-800 my-2"></div>

            {/* Sair */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
