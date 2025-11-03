/**
 * Servicio de gestión de sesión de administrador
 * 
 * En el ERS original, se guardaba 'adminSession' en localStorage
 * para saber si el usuario estaba en modo admin.
 * Este servicio centraliza esa lógica.
 */
import { storageService } from './storage.service';

export const adminService = {
  /**
   * Verifica si hay una sesión de administrador activa.
   */
  isAdminLoggedIn(): boolean {
    return storageService.read<boolean>(storageService.keys.admin, false);
  },

  /**
   * Inicia sesión como administrador.
   */
  login(): void {
    storageService.write(storageService.keys.admin, true);
  },

  /**
   * Cierra sesión de administrador.
   */
  logout(): void {
    storageService.write(storageService.keys.admin, false);
  }
};


