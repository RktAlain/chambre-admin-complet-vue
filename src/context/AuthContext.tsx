
import { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs statiques pour démonstration
const demoUsers: User[] = [
  {
    id: '1',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@hotel.com',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AS&backgroundColor=1e40af',
  },
  {
    id: '2',
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'reception@hotel.com',
    role: UserRole.RECEPTIONNISTE,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MD&backgroundColor=0891b2',
  },
];

// Fonction pour vérifier les identifiants (hardcodés pour la démonstration)
const checkCredentials = (email: string, password: string): User | null => {
  // Vérification simpliste pour la démonstration
  if (email === 'admin@hotel.com' && password === 'admin123') {
    return demoUsers[0];
  } else if (email === 'reception@hotel.com' && password === 'reception123') {
    return demoUsers[1];
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = checkCredentials(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
