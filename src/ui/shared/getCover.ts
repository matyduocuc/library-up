/**
 * Utilidad centralizada para resolver portadas de libros
 * 
 * Prioridad de resolución:
 * 1) Local por título (si existe en /public/img/books)
 * 2) Remota si es HTTPS válida
 * 3) Fallback si no hay ninguna disponible
 */

export const FALLBACK_COVER =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

// Mapeo "título → archivo local" (kebab-case sin tildes)
const LOCAL_MAP: Record<string, string> = {
  "Clean Code": "/img/books/clean-code.jpg",
  "Design Patterns": "/img/books/design-patterns.jpg",
  "Refactoring": "/img/books/refactoring.jpg",
  "Fundamentos de Bases de Datos": "/img/books/fundamentos-de-bases-de-datos.jpg",
  "You Don't Know JS": "/img/books/you-dont-know-js.jpg",
  "Sistemas Operativos Modernos": "/img/books/sistemas-operativos-modernos.jpg",
  "Computer Networks": "/img/books/computer-networks.jpg",
  "Patrones de Arquitectura": "/img/books/patrones-de-arquitectura.jpg",
};

/**
 * Valida y retorna URL HTTPS válida, o cadena vacía
 */
function httpsOrEmpty(url: string | undefined | null): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/**
 * Resuelve la URL de portada de un libro
 * Prioridad: 1) Local por título → 2) Remota HTTPS → 3) FALLBACK_COVER
 * 
 * @param book - Objeto libro con title, coverUrl o urlcover
 * @returns URL válida o FALLBACK_COVER si no hay portada válida
 */
export function resolveCover(book: { title?: string; coverUrl?: string; urlcover?: string }): string {
  // 1) Buscar imagen local por título
  const local = book.title ? LOCAL_MAP[book.title] : undefined;
  if (local) return local;

  // 2) Validar URL remota si existe
  const remote = httpsOrEmpty((book.coverUrl ?? book.urlcover ?? "").trim());
  if (remote) return remote;

  // 3) Retornar fallback si no hay imagen válida
  return FALLBACK_COVER;
}

/**
 * Añade cache-buster solo para URLs remotas de OpenLibrary
 * Los recursos locales de /public no necesitan cache-buster
 */
export function withCacheBuster(url: string): string {
  // Solo se aplica a URLs remotas (OpenLibrary)
  try {
    const u = new URL(url);
    if (u.hostname.includes("covers.openlibrary.org")) {
      u.searchParams.set("v", String(Date.now()).slice(-6));
      return u.toString();
    }
  } catch {
    // Si falla el parsing (puede ser ruta local), retornar la URL original
  }
  return url;
}

