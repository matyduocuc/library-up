/**
 * Servicio de gestión de préstamos con validaciones completas
 * 
 * Proporciona mensajes claros sobre por qué un préstamo falla,
 * cálculo de fechas de devolución, límites por usuario y prevención de duplicados.
 */
import type { Book } from '../domain/book';
import type { Loan } from '../domain/loan';
import { LOAN_DAYS, MAX_ACTIVE_LOANS_PER_USER, LoanErrorCode, type LoanResult } from '../domain/loan';
import { userService } from './user.service';
import { storageService } from './storage.service';

const K = { books: 'books', loans: 'loans' };

function read<T>(key: string, fallback: T): T {
  return storageService.read<T>(key, fallback);
}

function write<T>(key: string, value: T): void {
  storageService.write(key, value);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const loanValidationService = {
  /**
   * Obtiene todos los libros
   */
  getBooks(): Book[] {
    return read<Book[]>(K.books, []);
  },

  /**
   * Guarda el array de libros
   */
  saveBooks(books: Book[]): void {
    write(K.books, books);
  },

  /**
   * Obtiene todos los préstamos
   */
  getLoans(): Loan[] {
    return read<Loan[]>(K.loans, []);
  },

  /**
   * Guarda el array de préstamos
   */
  saveLoans(loans: Loan[]): void {
    write(K.loans, loans);
  },

  /**
   * Solicita un préstamo con validaciones completas
   * 
   * @param bookId - ID del libro a prestar
   * @returns LoanResult con mensaje claro del éxito o fallo
   */
  requestLoan(bookId: string): LoanResult {
    const session = userService.getSession();
    if (!session) {
      return {
        ok: false,
        code: LoanErrorCode.NOT_LOGGED_IN,
        message: 'Debes iniciar sesión para solicitar un préstamo.'
      };
    }

    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) {
      return {
        ok: false,
        code: LoanErrorCode.BOOK_NOT_FOUND,
        message: 'El libro que intentas prestar no existe.'
      };
    }

    if (book.status !== 'disponible') {
      return {
        ok: false,
        code: LoanErrorCode.BOOK_NOT_AVAILABLE,
        message: 'El libro no está disponible en este momento.'
      };
    }

    const loans = this.getLoans();
    const activeCount = loans.filter(l => l.userId === session.id && l.status === 'active').length;
    if (activeCount >= MAX_ACTIVE_LOANS_PER_USER) {
      return {
        ok: false,
        code: LoanErrorCode.USER_MAX_CAPACITY,
        message: `Has alcanzado el máximo de ${MAX_ACTIVE_LOANS_PER_USER} préstamos activos.`
      };
    }

    const duplicate = loans.find(
      l => l.userId === session.id && l.bookId === bookId && l.status === 'active'
    );
    if (duplicate) {
      return {
        ok: false,
        code: LoanErrorCode.DUPLICATE_ACTIVE_LOAN,
        message: 'Ya tienes este libro prestado actualmente.'
      };
    }

    const start = new Date();
    const due = addDays(start, LOAN_DAYS);
    const loan: Loan = {
      id: crypto.randomUUID(),
      userId: session.id,
      bookId,
      startDate: start.toISOString(),
      dueDate: due.toISOString(),
      status: 'active'
    };

    loans.push(loan);
    this.saveLoans(loans);

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], status: 'prestado' };
      this.saveBooks(books);
    }

    return {
      ok: true,
      loan,
      message: `Préstamo creado. Devuelve el ${due.toLocaleDateString()}.`
    };
  },

  /**
   * Devuelve un préstamo activo
   * 
   * @param loanId - ID del préstamo a devolver
   * @returns LoanResult con mensaje claro del éxito o fallo
   */
  returnLoan(loanId: string): LoanResult {
    const loans = this.getLoans();
    const loanIndex = loans.findIndex(l => l.id === loanId);
    
    if (loanIndex === -1) {
      return {
        ok: false,
        code: LoanErrorCode.LOAN_NOT_FOUND,
        message: 'No se encontró el préstamo indicado.'
      };
    }

    const loan = loans[loanIndex];
    if (loan.status !== 'active') {
      return {
        ok: false,
        code: LoanErrorCode.LOAN_ALREADY_RETURNED,
        message: 'Este préstamo ya fue devuelto.'
      };
    }

    loan.status = 'returned';
    loan.returnDate = new Date().toISOString();
    loans[loanIndex] = loan;
    this.saveLoans(loans);

    const books = this.getBooks();
    const bookIndex = books.findIndex(b => b.id === loan.bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = { ...books[bookIndex], status: 'disponible' };
      this.saveBooks(books);
    }

    return {
      ok: true,
      loan,
      message: 'Libro devuelto correctamente. ¡Gracias!'
    };
  }
};

