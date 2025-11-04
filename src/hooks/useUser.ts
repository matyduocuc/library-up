/**
 * Hook personalizado para acceder al contexto de usuario
 * 
 * Separado de UserContext.tsx para cumplir con los requisitos de Fast Refresh.
 * Fast Refresh requiere que los archivos de componentes solo exporten componentes.
 */
import { useContext } from 'react';
import { UserContext, type UserContextType } from '../contexts/UserContext.types';

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};

