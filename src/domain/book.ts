/**
 * Modelo de dominio para Book (Libro)
 * 
 * Representa un libro en el sistema de biblioteca.
 * Este modelo es puro TypeScript, sin dependencias de React ni de almacenamiento,
 * lo que permite reutilizarlo tanto en frontend como en backend futuro.
 */
export interface Book {
  id: string;            // Identificador único generado con crypto.randomUUID()
  title: string;        // Título del libro
  author: string;       // Autor del libro
  category: string;     // Categoría/temática del libro
  status: 'disponible' | 'prestado' | 'mantenimiento';  // Estado actual del libro
}


