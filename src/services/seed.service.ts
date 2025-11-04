/**
 * Servicio de seeds idempotente
 * 
 * Carga datos iniciales solo si localStorage está vacío.
 * Usa seeds organizados en /src/database.
 */
import { booksSeed, usersSeed } from '../database';
import type { User } from '../domain/user';
import { storageService } from './storage.service';

const K = { books: 'books', users: 'users', loans: 'loans' };

function hasData(key: string): boolean {
  try {
    const data = storageService.read<unknown[]>(key, []);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

export async function seedIfEmpty(): Promise<void> {
  if (!hasData(K.books)) {
    storageService.write(K.books, booksSeed);
  }

  if (!hasData(K.users)) {
    const users: User[] = await usersSeed();
    storageService.write(K.users, users);
  }

  if (!hasData(K.loans)) {
    storageService.write(K.loans, []);
  }
}

// Mantener compatibilidad con código existente
export const seedService = {
  async seedAll(): Promise<void> {
    await seedIfEmpty();
  }
};
