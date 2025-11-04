/**
 * Migración one-shot: actualiza la contraseña del admin a matyxd2006
 * 
 * Esta migración es idempotente: solo actualiza si el hash es diferente.
 * Se ejecuta automáticamente al iniciar la aplicación.
 */
import { sha256Hex } from '../crypto.util';

const KEY_USERS = 'users';
const TARGET_EMAIL = 'admin@libra.dev';

export async function migrateAdminPasswordToMatyxd2006(): Promise<void> {
  try {
    const raw = localStorage.getItem(KEY_USERS);
    if (!raw) return;
    
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) return;

    const idx = users.findIndex((u: { email?: string }) => u?.email?.toLowerCase() === TARGET_EMAIL.toLowerCase());
    if (idx === -1) return;

    const newHash = await sha256Hex('matyxd2006');

    // Solo actualiza si es diferente (idempotente)
    if (users[idx].passwordHash !== newHash) {
      users[idx].passwordHash = newHash;
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
      console.log('[Migración] Contraseña del admin actualizada a matyxd2006');
    }
  } catch (err) {
    console.error('[Migración] Error al actualizar contraseña del admin:', err);
  }
}

