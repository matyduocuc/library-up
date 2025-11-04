/**
 * Seeds de usuarios precargados
 * 
 * Admin con password ya hasheada por crypto.util.
 */
import type { User } from '../domain/user';
import { sha256Hex } from '../services/crypto.util';

export async function usersSeed(): Promise<User[]> {
  const adminHash = await sha256Hex('matyxd2006');
  const userHash = await sha256Hex('123456');
  
  return [
    {
      id: 'u1',
      name: 'Administrador',
      email: 'admin@libra.dev',
      role: 'Admin',
      passwordHash: adminHash,
    },
    {
      id: 'u2',
      name: 'Maty',
      email: 'maty@libra.dev',
      role: 'User',
      passwordHash: userHash,
    },
    {
      id: 'u3',
      name: 'Cami',
      email: 'cami@libra.dev',
      role: 'User',
      passwordHash: userHash,
    }
  ];
}

