/**
 * Modelo de dominio para Book (Libro)
 * 
 * Representa un libro en el sistema de biblioteca.
 */

/**
 * Estados posibles de un libro
 */
export const BookStatus = {
  DISPONIBLE: 'disponible',
  PRESTADO: 'prestado',
  RESERVADO: 'reservado'
} as const;

/**
 * Tipo de estado del libro (compatibilidad con código existente)
 */
export type BookStatusType = typeof BookStatus[keyof typeof BookStatus] | 'disponible' | 'prestado' | 'reservado';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string;
  status: BookStatusType;
}
