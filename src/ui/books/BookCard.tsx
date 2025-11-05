/**
 * Componente BookCard (Tarjeta de libro)
 * 
 * Muestra la información de un libro individual en formato de tarjeta Bootstrap.
 * Soporta agregar/eliminar del carrito con validaciones.
 */
import type { Book } from '../../domain/book';
import { Link, useNavigate } from 'react-router-dom';
import { resolveCover, FALLBACK_COVER, withCacheBuster } from '../shared/getCover';
import { cartService } from '../../services/cart.service';
import { validateAddToCart } from '../../services/cart-validation.service';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  showActions?: boolean;
  isInCart?: boolean;
  userId?: string | null;
  onCartChange?: () => void;
}

export function BookCard({ 
  book, 
  onSelect, 
  showActions = false,
  isInCart = false,
  userId = null,
  onCartChange
}: BookCardProps) {
  const navigate = useNavigate();
  const cover = resolveCover(book);
  const src = cover.startsWith("/img/") ? cover : withCacheBuster(cover);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      navigate('/login');
      return;
    }

    const validation = validateAddToCart(book.id, userId);
    if (!validation.canAdd) {
      alert(validation.message);
      return;
    }

    cartService.add(book.id);
    if (onCartChange) onCartChange();
    alert('Libro agregado al carrito correctamente.');
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    cartService.remove(book.id);
    if (onCartChange) onCartChange();
    alert('Libro eliminado del carrito.');
  };

  const cardContent = (
    <div className="card h-100 shadow-sm">
      <img
        src={src}
        alt={`Portada de ${book.title}`}
        className="card-img-top"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src !== FALLBACK_COVER) {
            img.src = FALLBACK_COVER;
          }
        }}
        style={{ objectFit: 'cover', height: 260 }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-subtitle text-muted mb-2">
          <i className="bi bi-person me-1"></i>{book.author}
        </p>
        {book.description && (
          <p className="card-text small text-muted clamp-2 mb-2">{book.description}</p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className={`badge ${book.status === 'disponible' ? 'bg-success' : 'bg-secondary'}`}>
            <i className={`bi ${book.status === 'disponible' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
            {book.status === 'disponible' ? 'Disponible' : 'Prestado'}
          </span>
          <small className="text-muted">
            <i className="bi bi-tag me-1"></i>{book.category}
          </small>
        </div>
        
        {/* Botones de acción para el carrito */}
        {!showActions && userId && book.status === 'disponible' && (
          <div className="mt-2">
            {isInCart ? (
              <button
                className="btn btn-outline-danger btn-sm w-100"
                onClick={handleRemoveFromCart}
                title="Eliminar del carrito"
              >
                <i className="bi bi-cart-dash me-1"></i>Eliminar del carrito
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={handleAddToCart}
                title="Agregar al carrito"
              >
                <i className="bi bi-cart-plus me-1"></i>Agregar al carrito
              </button>
            )}
          </div>
        )}

        {showActions && onSelect && (
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(book); }}
            disabled={book.status !== 'disponible'}
          >
            Solicitar Préstamo
          </button>
        )}
      </div>
    </div>
  );

  if (showActions && onSelect) {
    return cardContent;
  }

  return (
    <Link to={`/book/${book.id}`} className="text-decoration-none text-reset">
      {cardContent}
    </Link>
  );
}
