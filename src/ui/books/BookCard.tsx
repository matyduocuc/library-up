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
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt={`Portada de ${book.title}`}
          className="card-img-top"
          loading="lazy"
          style={{ objectFit: 'cover', height: 260 }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-subtitle text-muted mb-2">{book.author}</p>
        <span className={`badge align-self-start ${book.status === 'disponible' ? 'bg-success' : 'bg-secondary'}`}>
          {book.status}
        </span>
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
- Se añade <img> con coverUrl para mostrar la portada, con lazy-loading y altura fija responsiva.
- La card sigue siendo reusable: si no hay coverUrl, no se renderiza la imagen.
*/


