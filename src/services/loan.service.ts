/**
 * Servicio simple para gestionar préstamos
 * Lee y escribe préstamos en localStorage
 */
import { storageService } from './storage.service';
import type { LegacyLoan } from '../domain/loan';
import { bookService } from './book.service';

export const loanService = {
  /**
   * Obtiene todos los préstamos guardados
   */
  getAll(): LegacyLoan[] {
    return storageService.read<LegacyLoan[]>(storageService.keys.loans, []);
  },

  /**
   * Guarda todos los préstamos en localStorage
   */
  saveAll(loans: LegacyLoan[]): void {
    storageService.write(storageService.keys.loans, loans);
  },

  /**
   * Crea una solicitud de préstamo (estado: pendiente)
   * Duración: 14 días
   */
  request(userId: string, bookId: string): LegacyLoan {
    const prestamos = this.getAll();
    const hoy = new Date();
    const vencimiento = new Date(hoy);
    vencimiento.setDate(hoy.getDate() + 14); // 14 días después
    
    const nuevoPrestamo: LegacyLoan = {
      id: crypto.randomUUID(),
      userId,
      bookId,
      loanDate: hoy.toISOString(),
      dueDate: vencimiento.toISOString(),
      status: 'pendiente'
    };
    
    prestamos.push(nuevoPrestamo);
    this.saveAll(prestamos);
    return nuevoPrestamo;
  },

  /**
   * Aprueba un préstamo pendiente
   * Cambia el libro a estado 'prestado'
   */
  approve(loanId: string): LegacyLoan | null {
    const prestamos = this.getAll();
    const prestamo = prestamos.find(p => p.id === loanId);
    
    // Solo se puede aprobar si está pendiente
    if (!prestamo || prestamo.status !== 'pendiente') return null;

    prestamo.status = 'aprobado';
    // Marcar el libro como prestado
    bookService.update(prestamo.bookId, { status: 'prestado' });
    
    this.saveAll(prestamos);
    return prestamo;
  },

  /**
   * Rechaza un préstamo pendiente
   */
  reject(loanId: string): LegacyLoan | null {
    const prestamos = this.getAll();
    const prestamo = prestamos.find(p => p.id === loanId);
    
    // Solo se puede rechazar si está pendiente
    if (!prestamo || prestamo.status !== 'pendiente') return null;

    prestamo.status = 'rechazado';
    this.saveAll(prestamos);
    return prestamo;
  },

  /**
   * Marca un préstamo como devuelto
   * Cambia el libro a estado 'disponible'
   */
  returnBook(loanId: string): LegacyLoan | null {
    const prestamos = this.getAll();
    const prestamo = prestamos.find(p => p.id === loanId);
    
    // Solo se puede devolver si está aprobado
    if (!prestamo || prestamo.status !== 'aprobado') return null;

    prestamo.returnDate = new Date().toISOString();
    prestamo.status = 'devuelto';
    // Marcar el libro como disponible
    bookService.update(prestamo.bookId, { status: 'disponible' });
    
    this.saveAll(prestamos);
    return prestamo;
  },

  /**
   * Obtiene todos los préstamos de un usuario
   */
  getByUser(userId: string): LegacyLoan[] {
    const todos = this.getAll();
    return todos.filter(prestamo => prestamo.userId === userId);
  },

  /**
   * Obtiene todos los préstamos de un libro
   */
  getByBookId(bookId: string): LegacyLoan[] {
    const todos = this.getAll();
    return todos.filter(prestamo => prestamo.bookId === bookId);
  },

  /**
   * Busca un préstamo por su ID
   */
  getById(loanId: string): LegacyLoan | null {
    const prestamos = this.getAll();
    return prestamos.find(p => p.id === loanId) || null;
  },

  /**
   * Crea múltiples préstamos a la vez (para carrito)
   */
  requestMany(userId: string, bookIds: string[]): LegacyLoan[] {
    const prestamos = this.getAll();
    const hoy = new Date();
    const vencimiento = new Date(hoy);
    vencimiento.setDate(hoy.getDate() + 14); // 14 días después
    
    // Crear un préstamo para cada libro
    const nuevosPrestamos: LegacyLoan[] = bookIds.map(bookId => ({
      id: crypto.randomUUID(),
      userId,
      bookId,
      loanDate: hoy.toISOString(),
      dueDate: vencimiento.toISOString(),
      status: 'pendiente'
    }));
    
    prestamos.push(...nuevosPrestamos);
    this.saveAll(prestamos);
    return nuevosPrestamos;
  }
};


