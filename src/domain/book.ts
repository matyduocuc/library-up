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
  coverUrl: string;        // NUEVO: portada principal
  bannerUrl?: string;      // NUEVO: banner promocional opcional
  description?: string;    // NUEVO: breve descripción
}

/*
Explicación:
- Se agregan coverUrl, bannerUrl y description para enriquecer la experiencia visual y textual.
- Es retro-compatible: componentes que no usen estas props siguen funcionando por ser opcionales.
- Al centralizarlo en el modelo, la UI solo consume datos; si mañana cambiamos a API real, no hay que tocar la UI.
*/


