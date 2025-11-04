/**
 * Componente BookCard (Tarjeta de libro)
 * 
 * Muestra la información de un libro individual en formato de tarjeta Bootstrap.
 * Es reutilizable y puede usarse tanto en la vista de usuario como en la de admin.
 */
import type { Book } from '../../domain/book';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  showActions?: boolean;
}

export function BookCard({ book, onSelect, showActions = false }: BookCardProps) {
  const cardContent = (
    <div className="card h-100 shadow-sm">
      <img
        src={book.coverUrl || 'https://picsum.photos/seed/fallback/600/900'}
        alt={`Portada de ${book.title}`}
        className="card-img-top"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/600/900';
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

/*
Explicación:
- Consistencia visual: coverUrl y description ahora son requeridos en el modelo, mejorando la riqueza de las tarjetas.
- Fallback en onError evita "rotas" visuales si la imagen no carga (CORS/HTTPS).
- object-fit: cover mantiene estética con altura fija (height: 260).
- La descripción se muestra con clamp-2 para limitar a 2 líneas y mantener diseño limpio.
- Al hacer click en la card, navega a /book/:id para ver detalles completos.
- Los datos nuevos se reflejan automáticamente sin reload gracias al refresco en Catalog.
*/


