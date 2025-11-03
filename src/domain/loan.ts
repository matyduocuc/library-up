/**
 * Modelo de dominio para Loan (Préstamo)
 * 
 * Representa un préstamo de un libro a un usuario.
 * En el ERS original, los préstamos tenían estados: pendiente, aprobado, rechazado.
 * El returnDate es opcional porque un préstamo puede estar activo (sin fecha de devolución).
 */
export interface Loan {
  id: string;                    // Identificador único del préstamo
  userId: string;                // ID del usuario que solicita el préstamo
  bookId: string;                // ID del libro que se presta
  loanDate: string;              // Fecha de inicio del préstamo (ISO string)
  dueDate: string;               // Fecha de vencimiento (ISO string)
  returnDate?: string;           // Fecha de devolución (opcional, solo si ya se devolvió)
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto';  // Estado del préstamo
}


