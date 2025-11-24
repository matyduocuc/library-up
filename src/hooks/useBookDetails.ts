/**
 * Hook simple para obtener detalles de un libro
 * Si no hay bookId, no carga nada
 * Si falla la API, usa localStorage como respaldo
 */
import { useState, useEffect } from 'react';
import { booksApi } from '../api/booksApi';
import { ApiError } from '../api/httpClient';
import { mapLibroDTOToBook } from '../utils/bookMapper';
import { bookService } from '../services/book.service';
import type { Book } from '../domain/book';

// Lo que devuelve el hook
interface UseBookDetailsResult {
  book: Book | null;
  loading: boolean;
  error: ApiError | Error | null;
  reload: () => void;
}

export function useBookDetails(bookId: string | undefined): UseBookDetailsResult {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | Error | null>(null);

  // Función que carga el libro
  const loadBook = async () => {
    // Si no hay ID, mostrar error
    if (!bookId) {
      setError(new Error('ID de libro no proporcionado'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar cargar desde la API
      const numericId = parseInt(bookId, 10);
      if (isNaN(numericId)) {
        throw new Error('ID de libro inválido');
      }

      // Obtener libro de la API
      const libroDTO = await booksApi.getById(numericId);
      if (libroDTO) {
        // Convertir formato de la API al formato del frontend
        const mappedBook = mapLibroDTOToBook(libroDTO);
        setBook(mappedBook);
      } else {
        // Si la API retorna null, buscar en localStorage
        const localBook = bookService.getById(bookId);
        if (localBook) {
          setBook(localBook);
        } else {
          setError(new ApiError('Libro no encontrado', 404, 'Not Found'));
        }
      }
    } catch (err) {
      // Si falla la API, intentar usar localStorage
      try {
        const localBook = bookService.getById(bookId);
        if (localBook) {
          setBook(localBook);
          setError(null); // No hay error si funciona con localStorage
        } else {
          setError(err instanceof ApiError ? err : new Error('Error al cargar el libro'));
        }
      } catch {
        // Si todo falla, mostrar error
        setError(err instanceof ApiError ? err : new Error('Error al cargar el libro'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar libro cuando cambia el bookId
  useEffect(() => {
    loadBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  return {
    book,
    loading,
    error,
    reload: loadBook,
  };
}

