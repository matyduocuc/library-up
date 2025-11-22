/**
 * API client para microservicio de Libros
 */
import { httpClient, type ApiResponse, ApiError } from './httpClient';
import type { Book } from '../domain/book';

export interface CreateBookDto {
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string;
  status: 'disponible' | 'prestado';
}

export type UpdateBookDto = Partial<CreateBookDto>;

export const booksApi = {
  /**
   * Obtiene todos los libros
   */
  async getAll(): Promise<Book[]> {
    const response = await httpClient.get<ApiResponse<Book[]>>(
      `${httpClient.urls.books}`
    );
    return response.data || [];
  },

  /**
   * Obtiene un libro por ID
   */
  async getById(id: string): Promise<Book | null> {
    try {
      const response = await httpClient.get<ApiResponse<Book>>(
        `${httpClient.urls.books}/${id}`
      );
      return response.data || null;
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
  async create(book: CreateBookDto): Promise<Book> {
    const response = await httpClient.post<ApiResponse<Book>>(
      `${httpClient.urls.books}`,
      book
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Actualiza un libro existente
   */
  async update(id: string, book: UpdateBookDto): Promise<Book> {
    const response = await httpClient.put<ApiResponse<Book>>(
      `${httpClient.urls.books}/${id}`,
      book
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Elimina un libro
   */
  async delete(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<void>>(
      `${httpClient.urls.books}/${id}`
    );
  },

  /**
   * Busca libros por término
   */
  async search(query: string): Promise<Book[]> {
    const response = await httpClient.get<ApiResponse<Book[]>>(
      `${httpClient.urls.books}/search?q=${encodeURIComponent(query)}`
    );
    return response.data || [];
  },

  /**
   * Filtra libros por categoría
   */
  async filterByCategory(category: string): Promise<Book[]> {
    const response = await httpClient.get<ApiResponse<Book[]>>(
      `${httpClient.urls.books}?category=${encodeURIComponent(category)}`
    );
    return response.data || [];
  },
};

