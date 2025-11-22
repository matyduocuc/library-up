/**
 * Cliente HTTP centralizado para comunicación con microservicios
 * 
 * Configuración base para todas las llamadas API:
 * - Base URL configurable por variable de entorno
 * - Manejo homogéneo de errores
 * - Interceptores para headers comunes
 */

// URLs base de microservicios (configurables por .env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BOOKS_API_URL = import.meta.env.VITE_BOOKS_API_URL || `${API_BASE_URL}/api/books`;
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || `${API_BASE_URL}/api/users`;
const LOANS_API_URL = import.meta.env.VITE_LOANS_API_URL || `${API_BASE_URL}/api/loans`;

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Error personalizado para errores de API
 */
export class ApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Cliente HTTP genérico con manejo de errores
 */
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autenticación si existe
  const session = localStorage.getItem('session');
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData.token) {
        defaultHeaders['Authorization'] = `Bearer ${sessionData.token}`;
      }
    } catch {
      // Ignorar errores de parseo de sesión
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      let errorData: unknown = null;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          
          // Manejar formato estándar { success, message, error }
          if (typeof errorData === 'object' && errorData !== null) {
            const err = errorData as { success?: boolean; message?: string; error?: string; data?: unknown };
            errorMessage = err.message || err.error || errorMessage;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else {
          // Si no es JSON, intentar leer como texto
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
      } catch {
        // Si no se puede parsear el error, usar el mensaje por defecto
      }
      
      throw new ApiError(errorMessage, response.status, response.statusText);
    }

    // Si la respuesta está vacía (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    // Intentar parsear la respuesta como JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Si la respuesta tiene formato estándar { success, data, message }
      if (typeof data === 'object' && data !== null && 'success' in data) {
        const apiResponse = data as ApiResponse<T>;
        if (apiResponse.success && apiResponse.data !== undefined) {
          return apiResponse.data;
        } else {
          // Si success es false, lanzar error
          throw new ApiError(
            apiResponse.message || apiResponse.error || 'Error en la respuesta del servidor',
            response.status,
            response.statusText
          );
        }
      }
      
      // Si no tiene formato estándar, retornar la data directamente
      return data;
    }
    
    // Si no es JSON, intentar leer como texto
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    }
    
    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Error de red o timeout
    throw new ApiError(
      'Error de conexión. Verifica tu conexión a internet.',
      0,
      'Network Error'
    );
  }
}

/**
 * Cliente HTTP exportado con métodos helper
 */
export const httpClient = {
  /**
   * GET request
   */
  get: <T>(url: string): Promise<T> => {
    return request<T>(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T>(url: string, body: unknown): Promise<T> => {
    return request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * PUT request
   */
  put: <T>(url: string, body: unknown): Promise<T> => {
    return request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(url: string): Promise<T> => {
    return request<T>(url, { method: 'DELETE' });
  },

  // URLs exportadas para uso en otros módulos
  urls: {
    books: BOOKS_API_URL,
    users: USERS_API_URL,
    loans: LOANS_API_URL,
  },
};

