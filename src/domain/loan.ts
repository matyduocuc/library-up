/**
 * Modelo de dominio para Loan (Préstamo)
 * 
 * Representa un préstamo de un libro a un usuario.
 * Incluye validaciones y constantes para el servicio de préstamos.
 */
export type LoanStatus = 'active' | 'returned';

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  startDate: string;   // ISO string
  dueDate: string;     // ISO string
  returnDate?: string; // ISO string (opcional)
  status: LoanStatus;
}

// Constantes de validación
export const LOAN_DAYS = 14;
export const MAX_ACTIVE_LOANS_PER_USER = 3;

// Códigos de error para validación clara
export const LoanErrorCode = {
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  BOOK_NOT_FOUND: 'BOOK_NOT_FOUND',
  BOOK_NOT_AVAILABLE: 'BOOK_NOT_AVAILABLE',
  USER_MAX_CAPACITY: 'USER_MAX_CAPACITY',
  DUPLICATE_ACTIVE_LOAN: 'DUPLICATE_ACTIVE_LOAN',
  LOAN_NOT_FOUND: 'LOAN_NOT_FOUND',
  LOAN_ALREADY_RETURNED: 'LOAN_ALREADY_RETURNED',
} as const;

export type LoanErrorCode = typeof LoanErrorCode[keyof typeof LoanErrorCode];

// Tipos de resultado para operaciones de préstamo
export type LoanFail = { ok: false; code: LoanErrorCode; message: string };
export type LoanSuccess = { ok: true; message: string; loan: Loan };
export type LoanResult = LoanSuccess | LoanFail;

// Compatibilidad con el sistema anterior (tipos legacy)
export type LegacyLoanStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto';

/**
 * @deprecated Usar Loan con status 'active' | 'returned' en su lugar
 * Mantenido para compatibilidad con código existente
 */
export interface LegacyLoan {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: LegacyLoanStatus;
}
