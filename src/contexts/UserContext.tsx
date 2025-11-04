/**
 * Provider de contexto de usuario para manejo global de sesión
 * 
 * Inspirado en las mejores prácticas de React para gestión de estado global.
 * Centraliza la lógica de autenticación y sesión en un solo lugar,
 * evitando prop drilling y facilitando el acceso desde cualquier componente.
 */
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { userService } from '../services/user.service';
import type { PublicUser } from '../domain/user';
import { UserContext, type UserContextType } from './UserContext.types';

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

  const value: UserContextType = { user, login, logout, isLoading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/*
Explicación:
- UserProvider centraliza la gestión de sesión del usuario en toda la aplicación.
- Evita prop drilling: cualquier componente puede acceder al usuario sin pasar props.
- El estado se sincroniza con localStorage automáticamente mediante userService.
- isLoading permite mostrar un loader mientras se verifica la sesión guardada.
- El contexto y el hook están separados en archivos distintos para cumplir con Fast Refresh.
*/

