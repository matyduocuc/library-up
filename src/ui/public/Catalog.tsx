import { useEffect, useMemo, useState } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { BookCard } from '../books/BookCard';

export function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setBooks(bookService.getAll());
  }, []);

  const categories = useMemo(() => {
    const all = Array.from(new Set(books.map(b => b.category)));
    return all.sort();
  }, [books]);

  const filtered = useMemo(() => {
    let result = books;
    if (query) result = bookService.search(query);
    if (category) result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    return result;
  }, [books, query, category]);

  return (
    <div>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-6">
          <label className="form-label">Buscar</label>
          <input className="form-control" placeholder="Título o autor" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Todas</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
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


