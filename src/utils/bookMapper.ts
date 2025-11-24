/**
 * Funciones simples para convertir libros del backend al formato del frontend
 * 
 * El backend usa nombres en español (LibroDTO)
 * El frontend usa nombres en inglés (Book)
 */
import type { LibroDTO } from '../api/booksApi';
import type { Book } from '../domain/book';

/**
 * Convierte un libro del backend a formato del frontend
 * Cambia nombres: titulo -> title, portadaUrl -> coverUrl, etc.
 */
export function mapLibroDTOToBook(dto: LibroDTO): Book {
  // Formatear autor: combinar nombre y apellido
  let autor = 'Autor desconocido';
  if (dto.autor) {
    autor = `${dto.autor.nombre || ''} ${dto.autor.apellido || ''}`.trim();
    if (autor === '') autor = 'Autor desconocido';
  }

  // Determinar estado: disponible si hay ejemplares disponibles
  const disponible = dto.cantidadDisponible && dto.cantidadDisponible > 0;
  const estado = disponible ? 'disponible' : 'prestado';

  // Retornar libro en formato del frontend
  return {
    id: dto.id.toString(),
    title: dto.titulo || '',
    author: autor,
    category: dto.categoria?.nombre || 'Sin categoría',
    description: dto.descripcion || 'Sin descripción disponible',
    coverUrl: dto.portadaUrl || '/img/books/default.jpg',
    bannerUrl: undefined,
    status: estado,
  };
}

/**
 * Convierte un array de libros del backend al formato del frontend
 */
export function mapLibroDTOArrayToBooks(dtos: LibroDTO[]): Book[] {
  return dtos.map(mapLibroDTOToBook);
}

