/**
 * Contexto de usuario para manejo global de sesión
 * 
 * Inspirado en las mejores prácticas de React para gestión de estado global.
 * Centraliza la lógica de autenticación y sesión en un solo lugar,
 * evitando prop drilling y facilitando el acceso desde cualquier componente.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '../services/user.service';
import type { PublicUser } from '../domain/user';

interface UserContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    const savedUser = userService.getSession();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await userService.login(email, password);
    setUser(loggedUser);
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};

/*
Explicación:
- UserContext centraliza la gestión de sesión del usuario en toda la aplicación.
- Evita prop drilling: cualquier componente puede acceder al usuario sin pasar props.
- El estado se sincroniza con localStorage automáticamente mediante userService.
- isLoading permite mostrar un loader mientras se verifica la sesión guardada.
- Siguiendo patrones modernos de React con hooks personalizados (useUser).
*/

