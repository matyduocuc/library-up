/**
 * Contexto de usuario (solo el contexto, no el componente)
 * 
 * Separado de UserContext.tsx para cumplir con Fast Refresh.
 * Fast Refresh requiere que los archivos de componentes solo exporten componentes.
 */
import { createContext } from 'react';
import type { PublicUser } from '../domain/user';

export interface UserContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

