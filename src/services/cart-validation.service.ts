/**
 * Función de validación para agregar libros al carrito
 * 
 * Verifica que el usuario pueda agregar un libro al carrito antes de permitirlo.
 */
import { cartService } from '../services/cart.service';
import { loanService } from '../services/loan.service';
import { bookService } from '../services/book.service';
import { MAX_ACTIVE_LOANS_PER_USER } from '../domain/loan';

export interface CartValidationResult {
  canAdd: boolean;
  message: string;
  reason?: 'not_logged_in' | 'book_not_available' | 'already_in_cart' | 'max_capacity' | 'already_loaned';
}

/**
 * Valida si un libro puede ser agregado al carrito
 * 
 * @param bookId - ID del libro a agregar
 * @param userId - ID del usuario (null si no está autenticado)
 * @returns Resultado de la validación con mensaje claro
 */
export function validateAddToCart(bookId: string, userId: string | null): CartValidationResult {
  // 1. Verificar autenticación
  if (!userId) {
    return {
      canAdd: false,
      message: 'Debes iniciar sesión para agregar libros al carrito.',
      reason: 'not_logged_in'
    };
  }

  // 2. Verificar que el libro existe y está disponible
  const book = bookService.getById(bookId);
  if (!book) {
    return {
      canAdd: false,
      message: 'El libro no existe.',
      reason: 'book_not_available'
    };
  }

  if (book.status !== 'disponible') {
    return {
      canAdd: false,
      message: 'Este libro no está disponible para préstamo.',
      reason: 'book_not_available'
    };
  }

  // 3. Verificar que no esté ya en el carrito
  const cartItems = cartService.get();
  if (cartItems.some(item => item.bookId === bookId)) {
    return {
      canAdd: false,
      message: 'Este libro ya está en tu carrito.',
      reason: 'already_in_cart'
    };
  }

  // 4. Verificar préstamos activos + libros en carrito no excedan el límite
  const activeLoans = loanService.getByUser(userId).filter(loan => 
    loan.status === 'aprobado'
  );
  const cartBookIds = cartItems.map(item => item.bookId);
  const totalPending = activeLoans.length + cartBookIds.length;

  if (totalPending >= MAX_ACTIVE_LOANS_PER_USER) {
    return {
      canAdd: false,
      message: `Has alcanzado el límite de ${MAX_ACTIVE_LOANS_PER_USER} préstamos. Devuelve algunos libros o elimina libros del carrito.`,
      reason: 'max_capacity'
    };
  }

  // 5. Verificar que no tenga este libro ya prestado
  const hasActiveLoan = activeLoans.some(loan => loan.bookId === bookId);
  if (hasActiveLoan) {
    return {
      canAdd: false,
      message: 'Ya tienes este libro prestado actualmente.',
      reason: 'already_loaned'
    };
  }

  // Todo está bien
  return {
    canAdd: true,
    message: 'Libro agregado al carrito correctamente.'
  };
}

