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
   * Actualiza un usuario por ID
   */
  update(id: string, partial: Partial<User>): User | null {
    const current = this.getAll();
    const idx = current.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const updated = { ...current[idx], ...partial } as User;
    current[idx] = updated;
    this.saveAll(current);
    return updated;
  },

  /**
   * Elimina un usuario
   */
  remove(id: string): boolean {
    const current = this.getAll();
    const filtered = current.filter(u => u.id !== id);
    if (filtered.length === current.length) return false;
    this.saveAll(filtered);
    return true;
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
  },

  /**
   * Inicia sesión "ligera" por email; si existe el usuario lo guarda en session.
   */
  login(email: string): User | null {
    const user = this.getByEmail(email);
    if (user) {
      storageService.write(storageService.keys.session, user);
      return user;
    }
    return null;
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    storageService.write(storageService.keys.session, null);
  },

  /**
   * Obtiene la sesión actual
   */
  getSession(): User | null {
    return storageService.read<User | null>(storageService.keys.session, null);
  }
};


