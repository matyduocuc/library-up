/**
 * Funciones de mapeo entre LibroDTO (backend) y Book (frontend)
 * 
 * Convierte entre los DTOs del backend Spring Boot y los tipos del dominio frontend
 */
import type { LibroDTO } from '../api/booksApi';
import type { Book } from '../domain/book';

/**
 * Convierte LibroDTO (backend) a Book (frontend)
 */
export function mapLibroDTOToBook(dto: LibroDTO): Book {
  return {
    id: dto.id.toString(),
    title: dto.titulo || '',
    author: dto.autor ? `${dto.autor.nombre || ''} ${dto.autor.apellido || ''}`.trim() : 'Autor desconocido',
    category: dto.categoria?.nombre || 'Sin categoría',
    description: dto.descripcion || 'Sin descripción disponible',
    coverUrl: dto.portadaUrl || '/img/books/default.jpg',
    bannerUrl: undefined,
    status: dto.cantidadDisponible && dto.cantidadDisponible > 0 ? 'disponible' : 'prestado',
  };
}

/**
 * Convierte un array de LibroDTO a Book[]
 */
export function mapLibroDTOArrayToBooks(dtos: LibroDTO[]): Book[] {
  return dtos.map(mapLibroDTOToBook);
}

