/**
 * Pruebas unitarias para el servicio de libros
 * 
 * Verifica que las operaciones CRUD del servicio funcionen correctamente
 * con localStorage. Estas pruebas verifican la lógica de negocio.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { bookService } from '../services/book.service';
import type { Book } from '../domain/book';

describe('bookService', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('debe devolver un array vacío cuando no hay libros', () => {
    const books = bookService.getAll();
    expect(books).toEqual([]);
  });

  it('debe agregar un nuevo libro y generar un ID automáticamente', () => {
    const newBook = bookService.add({
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test Category',
      status: 'disponible'
    });

    expect(newBook.id).toBeDefined();
    expect(newBook.title).toBe('Test Book');
    expect(newBook.author).toBe('Test Author');
    
    const allBooks = bookService.getAll();
    expect(allBooks).toHaveLength(1);
    expect(allBooks[0]).toEqual(newBook);
  });

  it('debe actualizar un libro existente', () => {
    const book = bookService.add({
      title: 'Original Title',
      author: 'Original Author',
      category: 'Category',
      status: 'disponible'
    });

    const updated = bookService.update(book.id, { title: 'Updated Title' });
    
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.author).toBe('Original Author'); // Se mantiene
    
    const allBooks = bookService.getAll();
    expect(allBooks[0].title).toBe('Updated Title');
  });

  it('debe devolver null al intentar actualizar un libro inexistente', () => {
    const result = bookService.update('non-existent-id', { title: 'New Title' });
    expect(result).toBeNull();
  });

  it('debe obtener un libro por su ID', () => {
    const book = bookService.add({
      title: 'Test Book',
      author: 'Author',
      category: 'Category',
      status: 'disponible'
    });

    const found = bookService.getById(book.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(book.id);
    expect(found?.title).toBe('Test Book');
  });

  it('debe eliminar un libro', () => {
    const book = bookService.add({
      title: 'To Delete',
      author: 'Author',
      category: 'Category',
      status: 'disponible'
    });

    const deleted = bookService.delete(book.id);
    expect(deleted).toBe(true);
    
    const allBooks = bookService.getAll();
    expect(allBooks).toHaveLength(0);
    expect(bookService.getById(book.id)).toBeNull();
  });

  it('debe devolver false al intentar eliminar un libro inexistente', () => {
    const result = bookService.delete('non-existent-id');
    expect(result).toBe(false);
  });
});


