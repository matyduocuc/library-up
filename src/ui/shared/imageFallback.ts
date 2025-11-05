/**
 * Helper para manejo de imágenes con fallback automático
 * 
 * Si una portada falla por política de hotlink (403/404), usamos un proxy
 * de imágenes público que sirve la misma imagen sin romper el CORS/Referer.
 */
export function withImgFallback(url: string): string {
  // Limpia y codifica la URL original
  const encoded = encodeURIComponent(url);
  // images.weserv.nl es un proxy de solo lectura muy estable
  return `https://images.weserv.nl/?url=${encoded}`;
}

/**
 * Devuelve una lista de candidatos: [oficial, fallback-proxy]
 * Úsalo donde mapeas tus seeds a UI.
 * 
 * @example
 * const [main, fallback] = coverCandidates(book.coverUrl);
 * <img src={main} onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }} />
 */
export function coverCandidates(url: string): string[] {
  return [url, withImgFallback(url)];
}


