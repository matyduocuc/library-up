/**
 * Componente BookCard (Tarjeta de libro)
 * 
 * Muestra la información de un libro individual en formato de tarjeta Bootstrap.
 */
import type { Book } from '../../domain/book';
import { Link } from 'react-router-dom';
import { resolveCover, FALLBACK_COVER, withCacheBuster } from '../shared/getCover';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  showActions?: boolean;
}

export function BookCard({ book, onSelect, showActions = false }: BookCardProps) {
  const cover = resolveCover(book);
  const src = cover.startsWith("/img/") ? cover : withCacheBuster(cover);
  
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
