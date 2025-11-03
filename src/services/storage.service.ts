/**
 * Servicio de almacenamiento centralizado
 * 
 * Centraliza todas las operaciones de localStorage para evitar repetir código
 * de JSON.parse/stringify en cada servicio. Si en el futuro se cambia a IndexedDB
 * o a un backend real, solo hay que modificar este archivo.
 * 
 * Las claves usadas son las mismas que en el ERS original:
 * - 'libros' para el catálogo de libros
 * - 'usuarios' para los usuarios
 * - 'prestamos' para los préstamos
 * - 'adminSession' para la sesión de administrador
 */
const STORAGE_KEYS = {
  books: 'libros',
  users: 'usuarios',
  loans: 'prestamos',
  admin: 'adminSession'
} as const;

/**
 * Lee un valor del localStorage y lo parsea como JSON.
 * Si no existe o hay error, devuelve el valor por defecto.
 * 
 * @param key - Clave del localStorage
 * @param fallback - Valor por defecto si no existe o hay error
 * @returns El valor parseado o el fallback
 */
function read<T>(key: string, fallback: T): T {
  // Verificación de SSR (Server-Side Rendering) - en el navegador siempre será true
  if (typeof window === 'undefined') return fallback;
  
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Si hay error al parsear (JSON malformado), devolvemos el fallback
    return fallback;
  }
}

/**
 * Escribe un valor en el localStorage convirtiéndolo a JSON.
 * 
 * @param key - Clave del localStorage
 * @param value - Valor a guardar (será serializado como JSON)
 */
function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Exporta el servicio con las claves y las funciones read/write
 */
export const storageService = {
  keys: STORAGE_KEYS,
  read,
  write
};


