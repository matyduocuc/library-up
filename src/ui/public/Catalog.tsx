import { useEffect, useMemo, useState } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { BookCard } from '../books/BookCard';

export function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const reload = () => setBooks(bookService.getAll());

  useEffect(() => {
    reload();
    // Refrescar cada 500ms para detectar cambios en localStorage
    const interval = setInterval(reload, 500);
    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    const all = Array.from(new Set(books.map(b => b.category)));
    return all.sort();
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;
    if (query) {
      const q = query.trim().toLowerCase();
      if (q) {
        result = result.filter(b => 
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
        );
      }
    }
    if (category) {
      result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    return result;
  }, [books, query, category]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-3">
          <i className="bi bi-book me-2"></i>Catálogo de Libros
        </h2>
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">
              <i className="bi bi-search me-1"></i>Buscar
            </label>
            <input 
              className="form-control" 
              placeholder="Título o autor..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <i className="bi bi-filter me-1"></i>Categoría
            </label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <div className="text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              {filtered.length} libro{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {filtered.map(b => (
          <div className="col" key={b.id}>
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </div>
  );
}

/*
Explicación:
- El refresco automático mediante intervalo de 500ms detecta cambios en localStorage sin recargar la página.
- Esto permite que los libros creados desde Admin aparezcan inmediatamente en el catálogo público.
- El filtrado se hace en memoria sobre el estado local para mantener consistencia y rendimiento.
- La búsqueda y filtrado por categoría funcionan de forma reactiva gracias a useMemo.
*/
