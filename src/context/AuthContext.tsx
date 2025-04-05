import { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // En un caso real, aquí haríamos una llamada a la API
      // Simulamos una autenticación exitosa
      if (email === 'admin@example.com' && password === 'password') {
        setUser({
          id: '1',
          name: 'Administrador',
          email,
          role: 'admin'
        });
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'Administrador',
          email,
          role: 'admin'
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error durante el login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 