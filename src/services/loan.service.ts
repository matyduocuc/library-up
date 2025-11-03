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
import type { Loan } from '../domain/loan';
import { bookService } from './book.service';

export const loanService = {
  /**
   * Obtiene todos los préstamos.
   */
  getAll(): Loan[] {
    return storageService.read<Loan[]>(storageService.keys.loans, []);
  },

  /**
   * Guarda el array completo de préstamos.
   */
  saveAll(loans: Loan[]): void {
    storageService.write(storageService.keys.loans, loans);
  },

  /**
   * Crea un nuevo préstamo (simulación de préstamo del ERS).
   * El préstamo se crea con estado 'pendiente' hasta que el admin lo apruebe.
   * 
   * @param userId - ID del usuario que solicita el préstamo
   * @param bookId - ID del libro que se quiere prestar
   * @returns El préstamo creado
   */
  create(userId: string, bookId: string): Loan {
    const current = this.getAll();
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      userId,
      bookId,
      loanDate: new Date().toISOString(),
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
  approve(loanId: string): Loan | null {
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
  reject(loanId: string): Loan | null {
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
  return(loanId: string): Loan | null {
    const loans = this.getAll();
    const loan = loans.find(l => l.id === loanId);
    if (!loan || loan.status !== 'aprobado') return null;

    loan.returnDate = new Date().toISOString();
    // Actualizar estado del libro a 'disponible'
    bookService.update(loan.bookId, { status: 'disponible' });
    
    this.saveAll(loans);
    return loan;
  },

  /**
   * Obtiene todos los préstamos de un usuario.
   */
  getByUserId(userId: string): Loan[] {
    return this.getAll().filter(l => l.userId === userId);
  },

  /**
   * Obtiene todos los préstamos de un libro.
   */
  getByBookId(bookId: string): Loan[] {
    return this.getAll().filter(l => l.bookId === bookId);
  },

  /**
   * Obtiene un préstamo por su ID.
   */
  getById(loanId: string): Loan | null {
    const loans = this.getAll();
    return loans.find(l => l.id === loanId) || null;
  }
};


