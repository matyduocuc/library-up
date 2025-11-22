/**
 * Componente para mostrar errores de recursos (libro no encontrado, error de servidor, etc.)
 * 
 * Muestra diferentes mensajes según el tipo de error:
 * - 404: Recurso no encontrado
 * - 500: Error del servidor
 * - 0: Error de conexión/timeout
 */
import { ApiError } from '../../api/httpClient';
import { ErrorPage } from './ErrorPage';

interface ResourceErrorProps {
  error: Error | ApiError | null;
  resourceName?: string;
  showUrl?: boolean;
}

export function ResourceError({ error, resourceName = 'recurso', showUrl = true }: ResourceErrorProps) {
  if (!error) {
    return null;
  }

  let title: string;
  let message: string;

  if (error instanceof ApiError) {
    const status = error.status;
    
    if (status === 404) {
      title = `${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} no disponible`;
      message = `El ${resourceName} que estás buscando no existe o ha sido eliminado.`;
    } else if (status >= 500) {
      title = 'Error del servidor';
      message = `Ocurrió un error al cargar el ${resourceName}. Por favor, intenta nuevamente más tarde.`;
    } else if (status === 0) {
      title = 'Error de conexión';
      message = `No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.`;
    } else {
      title = 'Error al cargar';
      message = error.message || `Ocurrió un error al cargar el ${resourceName}.`;
    }
  } else {
    title = 'Error inesperado';
    message = error.message || `Ocurrió un error al cargar el ${resourceName}.`;
  }

  return (
    <ErrorPage 
      title={title}
      message={message}
      showUrl={showUrl}
      showBackButton={true}
    />
  );
}

