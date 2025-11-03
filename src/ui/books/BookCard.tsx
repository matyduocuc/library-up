/**
 * Componente BookCard (Tarjeta de libro)
 * 
 * Muestra la información de un libro individual en formato de tarjeta Bootstrap.
 * Es reutilizable y puede usarse tanto en la vista de usuario como en la de admin.
 */
import type { Book } from '../../domain/book';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  showActions?: boolean;
}

export function BookCard({ book, onSelect, showActions = false }: BookCardProps) {
  const statusColors = {
    disponible: 'bg-success',
    prestado: 'bg-warning',
    reservado: 'bg-info'
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-subtitle mb-2 text-muted">
          <strong>Autor:</strong> {book.author}
        </p>
        <p className="card-text">
          <small className="text-muted">
            <strong>Categoría:</strong> {book.category}
          </small>
        </p>
        <span className={`badge ${statusColors[book.status]} mt-auto`}>
          {book.status.toUpperCase()}
        </span>
        {showActions && onSelect && (
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={() => onSelect(book)}
            disabled={book.status !== 'disponible'}
          >
            Solicitar Préstamo
          </button>
        )}
      </div>
    </div>
  );
}


