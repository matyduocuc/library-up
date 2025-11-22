/**
 * Hook personalizado para obtener detalles de un libro
 * 
 * Maneja:
 * - Carga del libro
 * - Estados de loading y error
 * - Reintentos opcionales
 */
import { useState, useEffect } from 'react';
import { booksApi } from '../api/booksApi';
import { ApiError } from '../api/httpClient';
import type { Book } from '../domain/book';

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

  const loadBook = async () => {
    if (!bookId) {
      setError(new Error('ID de libro no proporcionado'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar primero con la API
      const bookData = await booksApi.getById(bookId);
      if (bookData) {
        setBook(bookData);
      } else {
        // Fallback a localStorage si la API retorna null
        const { bookService } = await import('../services/book.service');
        const localBook = bookService.getById(bookId);
        if (localBook) {
          setBook(localBook);
        } else {
          setError(new ApiError('Libro no encontrado', 404, 'Not Found'));
        }
      }
    } catch (err) {
      // Si hay error de API, intentar con localStorage como fallback
      try {
        const { bookService } = await import('../services/book.service');
        const localBook = bookService.getById(bookId);
        if (localBook) {
          setBook(localBook);
          setError(null); // No hay error si encontramos en localStorage
        } else {
          setError(err instanceof ApiError ? err : new Error('Error al cargar el libro'));
        }
      } catch {
        setError(err instanceof ApiError ? err : new Error('Error al cargar el libro'));
      }
    } finally {
      setLoading(false);
    }
  };

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

