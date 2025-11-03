/**
 * Servicio de gestión de usuarios
 * 
 * Maneja la lógica relacionada con usuarios del sistema.
 * Similar a bookService, pero para la entidad User.
 */
import { storageService } from './storage.service';
import type { User } from '../domain/user';

export const userService = {
  /**
   * Obtiene todos los usuarios registrados.
   */
  getAll(): User[] {
    return storageService.read<User[]>(storageService.keys.users, []);
  },

  /**
   * Guarda el array completo de usuarios.
   */
  saveAll(users: User[]): void {
    storageService.write(storageService.keys.users, users);
  },

  /**
   * Agrega un nuevo usuario.
   */
  add(user: Omit<User, 'id'>): User {
    const current = this.getAll();
    const newUser: User = { 
      ...user, 
      id: crypto.randomUUID() 
    };
    current.push(newUser);
    this.saveAll(current);
    return newUser;
  },

  /**
   * Busca un usuario por su ID.
   */
  getById(id: string): User | null {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  },

  /**
   * Busca un usuario por su email.
   */
  getByEmail(email: string): User | null {
    const users = this.getAll();
    return users.find(u => u.email === email) || null;
  }
};


