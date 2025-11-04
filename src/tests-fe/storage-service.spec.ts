/**
 * Pruebas unitarias para el servicio de almacenamiento
 * 
 * Verifica que las operaciones de lectura/escritura de localStorage
 * funcionen correctamente, incluyendo el manejo de errores.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storage.service';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe leer un valor que existe en localStorage', () => {
    const testData = { name: 'test', value: 123 };
    localStorage.setItem('test-key', JSON.stringify(testData));
    
    const result = storageService.read('test-key', {});
    expect(result).toEqual(testData);
  });

  it('debe devolver el fallback cuando la clave no existe', () => {
    const fallback = { default: true };
    const result = storageService.read('non-existent-key', fallback);
    expect(result).toEqual(fallback);
  });

  it('debe devolver el fallback cuando el JSON es inválido', () => {
    localStorage.setItem('invalid-json', 'not valid json {');
    const fallback = { default: true };
    
    const result = storageService.read('invalid-json', fallback);
    expect(result).toEqual(fallback);
  });

  it('debe escribir un valor en localStorage', () => {
    const testData = { name: 'write-test', value: 456 };
    storageService.write('write-key', testData);
    
    const stored = localStorage.getItem('write-key');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(testData);
  });

  it('debe usar las claves correctas definidas en STORAGE_KEYS', () => {
    expect(storageService.keys.books).toBe('books');
    expect(storageService.keys.users).toBe('users');
    expect(storageService.keys.loans).toBe('loans');
    expect(storageService.keys.session).toBe('session');
    expect(storageService.keys.admin).toBe('admin');
  });
});

