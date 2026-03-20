import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, auth, setUnauthorizedCallback } from '../lib/api';
import { User as UserType } from '../types/article';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserType>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Configurar callback para 401
  useEffect(() => {
    setUnauthorizedCallback(handleUnauthorized);
  }, []);

  // Carregar usuário ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (auth.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser({
          id: userData.id,
          nome: userData.nome || '',
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      auth.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    const response = await authService.login({ email, senha });
    
    if (response.token) {
      auth.setToken(response.token);
      
      // Carregar dados do usuário
      const userData = await authService.getCurrentUser();
      setUser({
        id: userData.id,
        nome: userData.nome || '',
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio
      });
    }
  };

  const logout = () => {
    auth.removeToken();
    setUser(null);
  };

  const handleUnauthorized = () => {
    logout();
  };

  const updateUser = (userData: Partial<UserType>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}