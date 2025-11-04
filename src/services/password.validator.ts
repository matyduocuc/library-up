/**
 * Validador de contraseñas
 * 
 * Valida que una contraseña cumpla con los requisitos de seguridad:
 * - Longitud entre 8 y 64 caracteres
 * - Al menos 1 letra mayúscula
 * - Al menos 1 letra minúscula
 * - Al menos 1 dígito
 */
export function validatePassword(pw: string): string | null {
  if (pw.length < 8 || pw.length > 64) {
    return 'La contraseña debe tener entre 8 y 64 caracteres.';
  }
  if (!/[A-Z]/.test(pw)) {
    return 'Debe incluir al menos una letra mayúscula.';
  }
  if (!/[a-z]/.test(pw)) {
    return 'Debe incluir al menos una letra minúscula.';
  }
  if (!/[0-9]/.test(pw)) {
    return 'Debe incluir al menos un dígito.';
  }
  return null; // válida
}

/*
Explicación:
- Valida reglas de seguridad en el frontend para mejor UX (feedback inmediato).
- Las mismas reglas pueden aplicarse en backend si se migra a API real.
*/


