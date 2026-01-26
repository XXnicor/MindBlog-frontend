import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, auth } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário ao iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (auth.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser({
          id: userData._id || userData.id,
          name: userData.nome || userData.name,
          email: userData.email,
          avatar: userData.avatar
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
        id: userData._id || userData.id,
        name: userData.nome || userData.name,
        email: userData.email,
        avatar: userData.avatar
      });
    }
  };

  const logout = () => {
    auth.removeToken();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
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
