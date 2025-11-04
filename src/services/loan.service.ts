/**
 * Servicio de gestión de préstamos
 * 
 * Contiene la lógica de negocio de los préstamos:
 * - Crear préstamos (simular préstamo del ERS)
 * - Aprobar/rechazar préstamos (función del admin)
 * - Marcar como devuelto
 * 
 * En el ERS original, los préstamos se guardaban en localStorage
 * con la clave 'prestamos'. Aquí centralizamos toda esa lógica.
 */
import { storageService } from './storage.service';
import type { LegacyLoan } from '../domain/loan';
import { bookService } from './book.service';

export const loanService = {
  /**
   * Obtiene todos los préstamos.
   */
  getAll(): LegacyLoan[] {
    return storageService.read<LegacyLoan[]>(storageService.keys.loans, []);
  },

  /**
   * Guarda el array completo de préstamos.
   */
  saveAll(loans: LegacyLoan[]): void {
    storageService.write(storageService.keys.loans, loans);
  },

  /**
   * Solicitud de préstamo: crea Loan en estado 'pendiente' con dueDate (14 días).
   * 
   * @param userId id del usuario
   * @param bookId id del libro
   * @returns préstamo creado
   */
  request(userId: string, bookId: string): LegacyLoan {
    const current = this.getAll();
    const now = new Date();
    const due = new Date(now);
    due.setDate(now.getDate() + 14);
    const newLoan: LegacyLoan = {
      id: crypto.randomUUID(),
      userId,
      bookId,
      loanDate: now.toISOString(),
      dueDate: due.toISOString(),
      status: 'pendiente'
    };
    current.push(newLoan);
    this.saveAll(current);
    return newLoan;
  },

  /**
   * Aprueba un préstamo pendiente.
   * Cambia el estado a 'aprobado' y actualiza el estado del libro a 'prestado'.
   * 
   * @param loanId - ID del préstamo a aprobar
   * @returns El préstamo actualizado, o null si no se encontró
   */
  approve(loanId: string): LegacyLoan | null {
    const loans = this.getAll();
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'pendiente') return null;

    loan.status = 'aprobado';
    // Actualizar estado del libro a 'prestado'
    bookService.update(loan.bookId, { status: 'prestado' });
    
    this.saveAll(loans);
    return loan;
  },

  /**
   * Rechaza un préstamo pendiente.
   * 
   * @param loanId - ID del préstamo a rechazar
   * @returns El préstamo actualizado, o null si no se encontró
   */
  reject(loanId: string): LegacyLoan | null {
    const loans = this.getAll();
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'pendiente') return null;

    loan.status = 'rechazado';
    this.saveAll(loans);
    return loan;
  },

  /**
   * Marca un préstamo como devuelto.
   * Cambia el estado del libro a 'disponible'.
   * 
   * @param loanId - ID del préstamo a devolver
   * @returns El préstamo actualizado, o null si no se encontró
   */
  returnBook(loanId: string): LegacyLoan | null {
    const loans = this.getAll();
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'aprobado') return null;

    loan.returnDate = new Date().toISOString();
    loan.status = 'devuelto';
    // Actualizar estado del libro a 'disponible'
    bookService.update(loan.bookId, { status: 'disponible' });
    
    this.saveAll(loans);
    return loan;
  },

  /**
   * Obtiene todos los préstamos de un usuario.
   */
  getByUser(userId: string): LegacyLoan[] {
    return this.getAll().filter(l => l.userId === userId);
  },

  /**
   * Obtiene todos los préstamos de un libro.
   */
  getByBookId(bookId: string): LegacyLoan[] {
    return this.getAll().filter(l => l.bookId === bookId);
  },

  /**
   * Obtiene un préstamo por su ID.
   */
  getById(loanId: string): LegacyLoan | null {
    const loans = this.getAll();
    return loans.find(l => l.id === loanId) || null;
  },

  /**
   * Crea múltiples préstamos en una sola operación (para carrito)
   */
  requestMany(userId: string, bookIds: string[]): LegacyLoan[] {
    const loans = this.getAll();
    const now = new Date();
    const due = new Date(now);
    due.setDate(now.getDate() + 14);
    const newLoans: LegacyLoan[] = bookIds.map(bookId => ({
      id: crypto.randomUUID(),
      userId,
      bookId,
      loanDate: now.toISOString(),
      dueDate: due.toISOString(),
      status: 'pendiente'
    }));
    loans.push(...newLoans);
    this.saveAll(loans);
    return newLoans;
  }
};


