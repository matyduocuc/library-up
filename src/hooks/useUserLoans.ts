/**
 * Hook simple para obtener préstamos del usuario
 * Si no hay userId, no carga nada
 * Si falla la API, usa localStorage como respaldo
 */
import { useState, useEffect } from 'react';
import { loansApi } from '../api/loansApi';
import { ApiError } from '../api/httpClient';
import { mapPrestamoDTOArrayToLegacyLoans } from '../utils/loanMapper';
import { bookService } from '../services/book.service';
import { loanService } from '../services/loan.service';
import type { LegacyLoan } from '../domain/loan';
import type { Book } from '../domain/book';

// Tipo: préstamo con información del libro
interface LoanWithBook extends LegacyLoan {
  book: Book | null;
}

// Lo que devuelve el hook
interface UseUserLoansResult {
  loans: LoanWithBook[];
  loading: boolean;
  error: ApiError | Error | null;
  reload: () => void;
}

export function useUserLoans(userId: string | undefined): UseUserLoansResult {
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | Error | null>(null);

  // Función que carga los préstamos
  const loadLoans = async () => {
    // Si no hay usuario, no hacer nada
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar cargar desde la API
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        throw new Error('ID de usuario inválido');
      }

      // Obtener préstamos de la API
      const prestamosDTO = await loansApi.getByUser(numericUserId);
      
      // Convertir formato de la API al formato del frontend
      const legacyLoans = mapPrestamoDTOArrayToLegacyLoans(prestamosDTO);
      
      // Agregar información del libro a cada préstamo
      const loansWithBooks: LoanWithBook[] = legacyLoans.map(loan => {
        const book = bookService.getById(loan.bookId);
        return {
          ...loan,
          book: book || null, // Si no encuentra el libro, poner null
        };
      });
      
      setLoans(loansWithBooks);
    } catch (err) {
      // Si falla la API, intentar usar localStorage
      try {
        const localLoans = loanService.getByUser(userId);
        
        // Agregar información del libro
        const loansWithBooks: LoanWithBook[] = localLoans.map(loan => {
          const book = bookService.getById(loan.bookId);
          return {
            ...loan,
            book: book || null,
          };
        });
        
        setLoans(loansWithBooks);
        setError(null); // No hay error si funciona con localStorage
      } catch {
        // Si todo falla, mostrar error
        setError(err instanceof ApiError ? err : new Error('Error al cargar los préstamos'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar préstamos cuando cambia el userId
  useEffect(() => {
    loadLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    loans,
    loading,
    error,
    reload: loadLoans,
  };
}

