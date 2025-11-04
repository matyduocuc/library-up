/**
 * Modelo de dominio para Book (Libro)
 * 
 * Representa un libro en el sistema de biblioteca.
 */
export type BookStatus = 'disponible' | 'prestado';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string;
  status: BookStatus;
}
