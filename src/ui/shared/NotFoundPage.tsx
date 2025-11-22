/**
 * Página 404 - Recurso no encontrado
 * 
 * Se muestra cuando:
 * - La ruta no existe
 * - Un recurso específico no se encuentra (libro, préstamo, etc.)
 */
import { useLocation } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';

export function NotFoundPage() {
  const location = useLocation();
  const isRouteNotFound = location.pathname !== '/' && !location.pathname.startsWith('/api');

  const title = isRouteNotFound 
    ? 'Página no encontrada' 
    : 'Recurso no encontrado';
  
  const message = isRouteNotFound
    ? 'La página que estás buscando no existe. Verifica la URL e intenta nuevamente.'
    : 'El recurso que estás buscando no existe o ha sido eliminado.';

  return (
    <ErrorPage 
      title={title}
      message={message}
      showUrl={true}
      showBackButton={true}
    />
  );
}

