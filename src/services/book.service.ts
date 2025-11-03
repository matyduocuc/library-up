/**
 * Servicio de gestión de libros
 * 
 * Contiene toda la lógica de negocio relacionada con los libros:
 * - Obtener el catálogo completo
 * - Agregar nuevos libros
 * - Actualizar libros existentes
 * 
 * En el ERS original, esta lógica estaba dispersa en funciones del script.js.
 * Aquí está centralizada y es reutilizable por cualquier componente React.
 * 
 * Si mañana se conecta un backend, solo hay que cambiar las llamadas
 * a storageService por llamadas a fetch/axios, pero la interfaz se mantiene igual.
 */
import { storageService } from './storage.service';
import type { Book } from '../domain/book';

export const bookService = {
  /**
   * Obtiene todos los libros del catálogo.
   * 
   * @returns Array de libros (vacío si no hay libros guardados)
   */
  getAll(): Book[] {
    return storageService.read<Book[]>(storageService.keys.books, []);
  },

  /**
   * Guarda el array completo de libros en localStorage.
   * 
   * @param books - Array de libros a guardar
   */
  saveAll(books: Book[]): void {
    storageService.write(storageService.keys.books, books);
  },

  /**
   * Agrega un nuevo libro al catálogo.
   * Genera automáticamente el ID usando crypto.randomUUID().
   * 
   * @param book - Datos del libro (sin ID, se genera automáticamente)
   * @returns El libro creado con su ID
   */
  add(book: Omit<Book, 'id'>): Book {
    const current = this.getAll();
    const newBook: Book = { 
      ...book, 
      id: crypto.randomUUID() 
    };
    current.push(newBook);
    this.saveAll(current);
    return newBook;
  },

  /**
   * Actualiza un libro existente.
   * 
   * @param id - ID del libro a actualizar
   * @param partial - Objeto con las propiedades a actualizar (parcial)
   * @returns El libro actualizado, o null si no se encontró
   */
  update(id: string, partial: Partial<Book>): Book | null {
    const current = this.getAll();
    const idx = current.findIndex(b => b.id === id);
    if (idx === -1) return null;
    
    const updated = { ...current[idx], ...partial };
    current[idx] = updated;
    this.saveAll(current);
    return updated;
  },

  /**
   * Busca un libro por su ID.
   * 
   * @param id - ID del libro
   * @returns El libro encontrado, o null si no existe
   */
  getById(id: string): Book | null {
    const books = this.getAll();
    return books.find(b => b.id === id) || null;
  },

  /**
   * Elimina un libro del catálogo.
   * 
   * @param id - ID del libro a eliminar
   * @returns true si se eliminó, false si no se encontró
   */
  delete(id: string): boolean {
    const current = this.getAll();
    const filtered = current.filter(b => b.id !== id);
    if (filtered.length === current.length) return false; // No se encontró
    
    this.saveAll(filtered);
    return true;
  }
};


