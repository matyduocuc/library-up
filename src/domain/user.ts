/**
 * Modelo de dominio para User (Usuario)
 * 
 * Representa un usuario del sistema de biblioteca.
 * En el ERS original, los usuarios eran datos simples.
 * Este modelo puede extenderse en el futuro con roles, permisos, etc.
 */
export interface User {
  id: string;      // Identificador único del usuario
  name: string;    // Nombre completo del usuario
  email: string;   // Email del usuario (puede usarse para login ligero)
  role: 'Admin' | 'User'; // Rol del usuario
  passwordHash: string; // NUEVO: hash de contraseña
}

/*
Explicación:
- Se agrega passwordHash para validar credenciales sin guardar texto plano.
- Esta estructura es compatible con un backend futuro (mismo campo).
*/


