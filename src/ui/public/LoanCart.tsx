import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { cartService } from '../../services/cart.service';
import { bookService } from '../../services/book.service';
import { loanService } from '../../services/loan.service';
import type { Book } from '../../domain/book';
import { resolveCover, FALLBACK_COVER, withCacheBuster } from '../shared/getCover';

export function LoanCart() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<Array<{ bookId: string; addedAt: string }>>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const items = cartService.get();
    setCartItems(items);
    const bookData = items.map(item => bookService.getById(item.bookId)).filter((b): b is Book => b !== null);
    setBooks(bookData);
  }, []);

  const handleRemove = (bookId: string) => {
    cartService.remove(bookId);
    setCartItems(cartService.get());
    setBooks(cartService.get().map(item => bookService.getById(item.bookId)).filter((b): b is Book => b !== null));
  };

  const handleConfirm = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const bookIds = cartItems.map(item => item.bookId);
    if (bookIds.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    const newLoans = loanService.requestMany(user.id, bookIds);
    cartService.clear();
    navigate('/receipt', { state: { loanIds: newLoans.map(l => l.id) } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Carrito de Préstamos</h2>
        <div className="alert alert-info">
          <i className="bi bi-cart me-2" />
          Tu carrito está vacío.
        </div>
        <button className="btn btn-outline-primary" onClick={() => navigate('/catalog')}>
          <i className="bi bi-arrow-left me-1" />
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        <i className="bi bi-cart me-2" />
        Carrito de Préstamos
      </h2>
      <div className="row g-3 mb-4">
        {books.map(book => {
          const cover = resolveCover(book);
          const src = cover.startsWith("/img/") ? cover : withCacheBuster(cover);
          return (
            <div key={book.id} className="col-12 col-md-6">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img 
                      src={src}
                      alt={book.title} 
                      className="img-fluid rounded-start" 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== FALLBACK_COVER) {
                          img.src = FALLBACK_COVER;
                        }
                      }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text small text-muted">{book.author}</p>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(book.id)}>
                        <i className="bi bi-trash me-1" />
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted">{cartItems.length} libro{cartItems.length !== 1 ? 's' : ''} en el carrito</span>
        <button className="btn btn-primary btn-lg rounded-3 shadow-sm" onClick={handleConfirm}>
          <i className="bi bi-check-circle me-2" />
          Confirmar Préstamo
        </button>
      </div>
    </div>
  );
}
