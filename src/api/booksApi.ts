/**
 * API client para microservicio de Libros
 * Conectado a: http://localhost:8082/api/libros
 */
import { httpClient, ApiError } from './httpClient';

// Tipos basados en el DTO del backend
export interface LibroDTO {
  id: number;
  titulo: string;
  isbn: string;
  descripcion?: string;
  anioPublicacion?: number;
  editorial?: string;
  idioma?: string;
  paginas?: number;
  portadaUrl?: string;
  cantidadTotal: number;
  cantidadDisponible: number;
  activo: boolean;
  fechaCreacion?: string;
  autor?: {
    id: number;
    nombre: string;
    apellido: string;
    nacionalidad?: string;
  };
  categoria?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
}

export interface LibroCreateRequest {
  titulo: string;
  isbn: string;
  descripcion?: string;
  anioPublicacion?: number;
  editorial?: string;
  idioma?: string;
  paginas?: number;
  portadaUrl?: string;
  cantidadTotal: number;
  autorId: number;
  categoriaId: number;
}

export interface BusquedaRequest {
  titulo?: string;
  isbn?: string;
  autorId?: number;
  categoriaId?: number;
  disponible?: boolean;
}

export const booksApi = {
  /**
   * Obtiene todos los libros
   */
  async getAll(): Promise<LibroDTO[]> {
    const data = await httpClient.get<LibroDTO[]>(`${httpClient.urls.books}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene un libro por ID
   */
  async getById(id: number): Promise<LibroDTO | null> {
    try {
      const data = await httpClient.get<LibroDTO>(`${httpClient.urls.books}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Crea un nuevo libro
   */
  async create(book: LibroCreateRequest): Promise<LibroDTO> {
    return await httpClient.post<LibroDTO>(`${httpClient.urls.books}`, book);
  },

  /**
   * Actualiza un libro existente
   */
  async update(id: number, book: LibroCreateRequest): Promise<LibroDTO> {
    return await httpClient.put<LibroDTO>(`${httpClient.urls.books}/${id}`, book);
  },

  /**
   * Elimina un libro
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`${httpClient.urls.books}/${id}`);
  },

  /**
   * Busca libros con criterios avanzados
   */
  async search(criteria: BusquedaRequest): Promise<LibroDTO[]> {
    const data = await httpClient.post<LibroDTO[]>(`${httpClient.urls.books}/buscar`, criteria);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene libros disponibles
   */
  async getAvailable(): Promise<LibroDTO[]> {
    const data = await httpClient.get<LibroDTO[]>(`${httpClient.urls.books}/disponibles`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene libros por categoría
   */
  async getByCategory(categoria: string): Promise<LibroDTO[]> {
    const data = await httpClient.get<LibroDTO[]>(`${httpClient.urls.books}/categoria/${encodeURIComponent(categoria)}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene libros por autor
   */
  async getByAuthor(autor: string): Promise<LibroDTO[]> {
    const data = await httpClient.get<LibroDTO[]>(`${httpClient.urls.books}/autor/${encodeURIComponent(autor)}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Actualiza el stock de un libro
   */
  async updateStock(id: number, cantidad: number): Promise<LibroDTO> {
    return await httpClient.patch<LibroDTO>(`${httpClient.urls.books}/${id}/stock?cantidad=${cantidad}`, {});
  },

  /**
   * Verifica si un ISBN existe
   */
  async verifyIsbn(isbn: string): Promise<{ mensaje: string; existe: boolean }> {
    return await httpClient.get<{ mensaje: string; existe: boolean }>(`${httpClient.urls.books}/verificar-isbn/${encodeURIComponent(isbn)}`);
  },
};
