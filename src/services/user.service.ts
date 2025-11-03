/**
 * Servicio de gestión de usuarios
 * 
 * Maneja la lógica relacionada con usuarios del sistema.
 * Similar a bookService, pero para la entidad User.
 */
import { storageService } from './storage.service';
import type { User } from '../domain/user';
import { sha256 } from './hash.util';

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
   * Guarda el array completo de usuarios (alias para compatibilidad)
   */
  setSession(user: User | null): void {
    storageService.write(storageService.keys.session, user);
  },

  /**
   * Registra un nuevo usuario con contraseña hasheada
   */
  async register(name: string, email: string, password: string, role: User['role'] = 'User'): Promise<User> {
    const users = this.getAll();
    if (users.some(u => u.email === email)) {
      throw new Error('Email ya registrado');
    }
    const passwordHash = await sha256(password);
    const newUser: User = { id: crypto.randomUUID(), name, email, role, passwordHash };
    users.push(newUser);
    this.saveAll(users);
    return newUser;
  },

  /**
   * Inicia sesión con email y contraseña (valida hash)
   */
  async login(email: string, password: string): Promise<User> {
    const users = this.getAll();
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const passwordHash = await sha256(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Contraseña incorrecta');
    }
    this.setSession(user);
    return user;
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    this.setSession(null);
  },

  /**
   * Obtiene la sesión actual
   */
  getSession(): User | null {
    return storageService.read<User | null>(storageService.keys.session, null);
  }
};

/*
Explicación:
- register/login trabajan con hash de contraseña; la sesión se guarda en localStorage.
- El resto de la app solo lee userService.getSession() para saber si hay login.
*/


