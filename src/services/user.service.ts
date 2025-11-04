/**
 * Servicio de gestión de usuarios
 * 
 * Maneja la lógica relacionada con usuarios del sistema.
 * Centraliza el manejo de passwordHash: la UI nunca lo toca directamente.
 */
import { storageService } from './storage.service';
import type { User, PublicUser, CreateUserDto } from '../domain/user';
import { sha256Hex } from './crypto.util';

const K = { users: 'users', session: 'session' };

/**
 * Convierte User interno a PublicUser (sin passwordHash)
 */
function toPublic(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  };
}

export const userService = {
  /**
   * Obtiene todos los usuarios registrados (internos con passwordHash)
   */
  getAll(): User[] {
    return storageService.read<User[]>(K.users, []);
  },

  /**
   * Guarda el array completo de usuarios
   */
  saveAll(users: User[]): void {
    storageService.write(K.users, users);
  },

  /**
   * Busca un usuario por email (case-insensitive)
   */
  findByEmail(email: string): User | null {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /**
   * Busca un usuario por su ID
   */
  getById(id: string): User | null {
    return this.getAll().find(u => u.id === id) || null;
  },

  /**
   * Crea un usuario desde Admin (genera passwordHash automáticamente)
   */
  async createByAdmin(dto: CreateUserDto): Promise<PublicUser> {
    if (this.findByEmail(dto.email)) {
      throw new Error('Email ya registrado');
    }
    const passwordHash = await sha256Hex(dto.password);
    const newUser: User = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role,
      passwordHash
    };
    const list = this.getAll();
    list.push(newUser);
    this.saveAll(list);
    return toPublic(newUser);
  },

  /**
   * Registra un nuevo usuario (genera passwordHash automáticamente)
   */
  async register(dto: Omit<CreateUserDto, 'role'> & { role?: 'User' }): Promise<PublicUser> {
    const role = dto.role ?? 'User';
    return this.createByAdmin({ ...dto, role });
  },

  /**
   * Inicia sesión con email y contraseña (valida hash)
   */
  async login(email: string, password: string): Promise<PublicUser> {
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const passwordHash = await sha256Hex(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Contraseña incorrecta');
    }
    const publicUser = toPublic(user);
    this.setSession(publicUser);
    return publicUser;
  },

  /**
   * Cierra sesión
   */
  logout(): void {
    this.setSession(null);
  },

  /**
   * Guarda la sesión actual (solo PublicUser, sin passwordHash)
   */
  setSession(user: PublicUser | null): void {
    storageService.write(K.session, user);
  },

  /**
   * Obtiene la sesión actual (PublicUser sin passwordHash)
   */
  getSession(): PublicUser | null {
    return storageService.read<PublicUser | null>(K.session, null);
  },

  /**
   * Actualiza un usuario por ID (solo campos públicos, sin passwordHash)
   */
  update(id: string, partial: Partial<PublicUser>): PublicUser | null {
    const current = this.getAll();
    const idx = current.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    const updated: User = { ...current[idx], ...partial };
    current[idx] = updated;
    this.saveAll(current);
    return toPublic(updated);
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
   * @deprecated Usar createByAdmin o register en su lugar
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
   * @deprecated Usar findByEmail en su lugar
   */
  getByEmail(email: string): User | null {
    return this.findByEmail(email);
  }
};

/*
Explicación:
- El servicio maneja automáticamente el hash de contraseñas: UI nunca toca passwordHash.
- createByAdmin y register reciben CreateUserDto con password en texto plano.
- login, getSession y setSession trabajan con PublicUser (sin passwordHash).
- Separación clara: User interno vs PublicUser para UI.
- Unifica el hash: seed y login usan la misma función sha256Hex de crypto.util.
- Compatible con backend futuro: mismo contrato de tipos.
*/


