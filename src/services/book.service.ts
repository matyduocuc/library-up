/**
 * Servicio simple para gestionar libros
 * Lee y escribe libros en localStorage
 */
import { storageService } from './storage.service';
import type { Book } from '../domain/book';

export const bookService = {
  /**
   * Obtiene todos los libros guardados
   */
  getAll(): Book[] {
    return storageService.read<Book[]>(storageService.keys.books, []);
  },

  /**
   * Busca libros por título o autor
   */
  search(query: string): Book[] {
    const busqueda = query.trim().toLowerCase();
    if (!busqueda) return this.getAll();
    
    const todos = this.getAll();
    return todos.filter(libro => 
      libro.title.toLowerCase().includes(busqueda) ||
      libro.author.toLowerCase().includes(busqueda)
    );
  },

  /**
   * Filtra libros por categoría
   */
  filterByCategory(category: string): Book[] {
    const categoria = category.trim().toLowerCase();
    if (!categoria) return this.getAll();
    
    const todos = this.getAll();
    return todos.filter(libro => libro.category.toLowerCase() === categoria);
  },

  /**
   * Guarda todos los libros en localStorage
   */
  saveAll(books: Book[]): void {
    storageService.write(storageService.keys.books, books);
  },

  /**
   * Agrega un nuevo libro (genera ID automáticamente)
   */
  add(book: Omit<Book, 'id'>): Book {
    const libros = this.getAll();
    const nuevoLibro: Book = { 
      ...book, 
      id: crypto.randomUUID() // Generar ID único
    };
    libros.push(nuevoLibro);
    this.saveAll(libros);
    return nuevoLibro;
  },

  /**
   * Actualiza un libro existente
   */
  update(id: string, cambios: Partial<Book>): Book | null {
    const libros = this.getAll();
    const indice = libros.findIndex(libro => libro.id === id);
    
    if (indice === -1) return null; // No se encontró
    
    // Actualizar libro con los nuevos datos
    const libroActualizado = { ...libros[indice], ...cambios };
    libros[indice] = libroActualizado;
    this.saveAll(libros);
    
    return libroActualizado;
  },

  /**
   * Busca un libro por su ID
   */
  getById(id: string): Book | null {
    const libros = this.getAll();
    return libros.find(libro => libro.id === id) || null;
  },

  /**
   * Elimina un libro del catálogo
   */
  delete(id: string): boolean {
    const libros = this.getAll();
    const filtrados = libros.filter(libro => libro.id !== id);
    
    // Si no cambió la cantidad, no se encontró el libro
    if (filtrados.length === libros.length) return false;
    
    this.saveAll(filtrados);
    return true;
  },

  /**
   * Alias para delete (mismo nombre usado en otros lugares)
   */
  remove(id: string): boolean {
    return this.delete(id);
  }
};


