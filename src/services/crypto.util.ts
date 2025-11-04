/**
 * Utilidad de hash SHA-256 unificada
 * 
 * Función única para hashing de contraseñas en toda la aplicación.
 * Usa Web Crypto API para generar hash SHA-256 hexadecimal.
 */
export async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

