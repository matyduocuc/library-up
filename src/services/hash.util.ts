/**
 * Utilidad de hashing seguro usando Web Crypto API
 * 
 * Genera hash SHA-256 de texto para almacenamiento seguro de contraseñas.
 */
export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/*
Explicación:
- Se usa Web Crypto API para derivar un hash SHA-256 en el browser.
- Evita guardar contraseñas en texto plano aunque no haya backend.
*/

