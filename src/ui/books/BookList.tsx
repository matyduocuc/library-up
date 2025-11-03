/**
 * Componente BookList (Lista de libros)
 * 
 * Muestra el catálogo completo de libros usando un grid responsivo de Bootstrap.
 * Carga los libros del servicio al montarse el componente.
 */
import { useEffect, useState } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { BookCard } from './BookCard';

interface BookListProps {
  onSelectBook?: (book: Book) => void;
  showActions?: boolean;
}

export function BookList({ onSelectBook, showActions = false }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Cargar libros al montar el componente
    setBooks(bookService.getAll());
  }, []);

  if (books.length === 0) {
    return (
      <div className="alert alert-info">
        <h4>Catálogo vacío</h4>
        <p>No hay libros disponibles en el catálogo.</p>
      </div>
    );
  }

  return (
    <div className="row">
      {books.map(book => (
        <div key={book.id} className="col-12 col-md-6 col-lg-4 mb-3">
          <BookCard
            book={book}
            onSelect={onSelectBook}
            showActions={showActions}
          />
        </div>
      ))}
    </div>
  );
}

