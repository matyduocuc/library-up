/**
 * Servicio de carrito de préstamos
 * 
 * Gestiona el carrito local donde el usuario agrega libros antes de confirmar préstamos.
 */
import { storageService } from './storage.service';

type CartItem = { bookId: string; addedAt: string };

export const cartService = {
  get(): CartItem[] {
    return storageService.read<CartItem[]>(storageService.keys.cart, []);
  },
  set(items: CartItem[]): void {
    storageService.write(storageService.keys.cart, items);
  },
  add(bookId: string): void {
    const items = this.get();
    if (!items.find(i => i.bookId === bookId)) {
      items.push({ bookId, addedAt: new Date().toISOString() });
      this.set(items);
    }
  },
  remove(bookId: string): void {
    this.set(this.get().filter(i => i.bookId !== bookId));
  },
  clear(): void {
    this.set([]);
  },
  count(): number {
    return this.get().length;
  }
};

/*
Explicación:
- Carrito simple: lista de bookId. Permite experiencia "tipo e-commerce".
*/


