/**
 * Hook personalizado para obtener préstamos del usuario actual
 * 
 * Maneja:
 * - Carga de préstamos
 * - Estados de loading y error
 * - Integración con libros
 */
import { useState, useEffect } from 'react';
import { loansApi } from '../api/loansApi';
import { ApiError } from '../api/httpClient';
import { bookService } from '../services/book.service';
import type { LegacyLoan } from '../domain/loan';
import type { Book } from '../domain/book';

interface LoanWithBook extends LegacyLoan {
  book: Book | null;
}

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

  const loadLoans = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar primero con la API
      const userLoans = await loansApi.getByUser(userId);
      
      // Enriquecer con información de libros
      const loansWithBooks: LoanWithBook[] = userLoans.map(loan => {
        const book = bookService.getById(loan.bookId);
        return {
          ...loan,
          book: book || null,
        };
      });
      
      setLoans(loansWithBooks);
    } catch (err) {
      // Fallback a localStorage si la API falla
      try {
        const { loanService } = await import('../services/loan.service');
        const localLoans = loanService.getByUser(userId);
        
        const loansWithBooks: LoanWithBook[] = localLoans.map(loan => {
          const book = bookService.getById(loan.bookId);
          return {
            ...loan,
            book: book || null,
          };
        });
        
        setLoans(loansWithBooks);
        setError(null); // No hay error si encontramos en localStorage
      } catch {
        setError(err instanceof ApiError ? err : new Error('Error al cargar los préstamos'));
      }
    } finally {
      setLoading(false);
    }
  };

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

