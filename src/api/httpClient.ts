/**
 * Cliente HTTP simple para comunicarse con los microservicios de Java
 * 
 * URLs de los 4 microservicios principales:
 * - Libros: puerto 8082
 * - Usuarios: puerto 8081
 * - Préstamos: puerto 8083
 * - Informes: puerto 8085
 */

// URLs de los microservicios principales (puedes cambiarlas en un archivo .env si necesitas)
const BOOKS_API_URL = import.meta.env.VITE_BOOKS_API_URL || 'http://localhost:8082/api/libros';
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:8081/api/usuarios';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081/api/auth';
const LOANS_API_URL = import.meta.env.VITE_LOANS_API_URL || 'http://localhost:8083/api/v1/prestamos';
const REPORTS_API_URL = import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:8085/api/informes';

// URLs opcionales (no usadas en los 4 microservicios principales)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const COURSES_API_URL = import.meta.env.VITE_COURSES_API_URL || `${API_BASE_URL}/api/v1/course`;
const STUDENTS_API_URL = import.meta.env.VITE_STUDENTS_API_URL || `${API_BASE_URL}/api/v1/student`;

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
 * Función simple para hacer peticiones HTTP a los microservicios
 * Maneja automáticamente el formato de respuesta del backend Java
 */
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  // Headers por defecto
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Agregar token si el usuario está logueado
  const session = localStorage.getItem('session');
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData.token) {
        headers['Authorization'] = `Bearer ${sessionData.token}`;
      }
    } catch {
      // Si hay error al parsear, continuar sin token
    }
  }

  // Hacer la petición
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // Si hay error en la respuesta
  if (!response.ok) {
    let mensaje = `Error ${response.status}: ${response.statusText}`;
    
    // Intentar obtener mensaje de error del backend
    try {
      const errorData = await response.json();
      if (errorData.message) mensaje = errorData.message;
      else if (errorData.error) mensaje = errorData.error;
    } catch {
      // Si no se puede parsear, usar mensaje por defecto
    }
    
    throw new ApiError(mensaje, response.status, response.statusText);
  }

  // Si la respuesta está vacía (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Parsear la respuesta JSON
  const data = await response.json();
  
  // El backend Java devuelve respuestas en formato { ok: true, data: {...} }
  // o directamente los datos
  if (typeof data === 'object' && data !== null && 'ok' in data) {
    // Formato con 'ok': extraer el campo 'data'
    const respuesta = data as { ok: boolean; data?: T; message?: string };
    if (respuesta.ok && respuesta.data !== undefined) {
      return respuesta.data;
    } else {
      throw new ApiError(
        respuesta.message || 'Error en la respuesta del servidor',
        response.status,
        response.statusText
      );
    }
  }
  
  // Si no tiene formato 'ok', retornar directamente
  return data;
}

/**
 * Cliente HTTP con métodos simples para GET, POST, PUT, DELETE
 */
export const httpClient = {
  /**
   * GET: obtener datos
   */
  get: <T>(url: string): Promise<T> => {
    return request<T>(url, { method: 'GET' });
  },

  /**
   * POST: crear nuevo
   */
  post: <T>(url: string, body: unknown): Promise<T> => {
    return request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * PUT: actualizar
   */
  put: <T>(url: string, body: unknown): Promise<T> => {
    return request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * DELETE: eliminar
   */
  delete: <T>(url: string): Promise<T> => {
    return request<T>(url, { method: 'DELETE' });
  },

  /**
   * PATCH: actualización parcial
   */
  patch: <T>(url: string, body: unknown): Promise<T> => {
    return request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  // URLs de los microservicios (para usar en otros archivos)
  urls: {
    books: BOOKS_API_URL,
    users: USERS_API_URL,
    auth: AUTH_API_URL,
    loans: LOANS_API_URL,
    reports: REPORTS_API_URL,
    courses: COURSES_API_URL,  // Opcional (no usado en los 4 principales)
    students: STUDENTS_API_URL, // Opcional (no usado en los 4 principales)
  },
};

