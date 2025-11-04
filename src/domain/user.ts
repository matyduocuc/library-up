/**
 * Modelo de dominio para User (Usuario)
 * 
 * Representa un usuario del sistema de biblioteca.
 * User completo incluye passwordHash (solo para servicios internos).
 * La UI nunca debe trabajar directamente con passwordHash.
 */
export interface User {
  id: string;      // Identificador único del usuario
  name: string;    // Nombre completo del usuario
  email: string;   // Email del usuario (puede usarse para login ligero)
  role: 'Admin' | 'User'; // Rol del usuario
  passwordHash: string; // Hash SHA-256 de la contraseña (solo en backend/servicio)
}

/**
 * Usuario público sin passwordHash para mostrar en UI
 */
export type PublicUser = Omit<User, 'passwordHash'>;

/**
 * DTO para crear usuarios desde la UI (Admin o Registro)
 * Contiene contraseña en texto plano que será hasheada por el servicio
 */
export type CreateUserDto = {
  name: string;
  email: string;
  role: 'Admin' | 'User';
  password: string;  // Texto plano SOLO transitorio en UI -> se hashea en el servicio
};

/*
Explicación:
- User: tipo completo con passwordHash (solo usado internamente en servicios).
- PublicUser: tipo sin passwordHash para exponer en UI y sesión.
- CreateUserDto: tipo para recibir datos de creación desde UI (incluye password en texto plano).
- Separación de responsabilidades: UI nunca maneja passwordHash directamente.
- Compatible con backend futuro: mismo contrato de tipos.
*/


