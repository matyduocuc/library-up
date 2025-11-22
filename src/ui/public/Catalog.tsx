import { useEffect, useMemo, useState } from 'react';
import { booksApi } from '../../api/booksApi';
import { ApiError } from '../../api/httpClient';
import { mapLibroDTOArrayToBooks } from '../../utils/bookMapper';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import { BookCard } from '../books/BookCard';
import { useUser } from '../../hooks/useUser';
import { cartService } from '../../services/cart.service';
import { ResourceError } from '../shared/ResourceError';
import { EmptyState } from '../shared/EmptyState';

export function Catalog() {
  const { user } = useUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [cartItems, setCartItems] = useState<Array<{ bookId: string; addedAt: string }>>([]);

  const reload = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar primero con la API
      const librosDTO = await booksApi.getAll();
      // Mapear LibroDTO[] a Book[]
      const mappedBooks = mapLibroDTOArrayToBooks(librosDTO);
      setBooks(mappedBooks);
    } catch (err) {
      // Fallback a localStorage si la API falla
      try {
        const localBooks = bookService.getAll();
        setBooks(localBooks);
        setError(null); // No hay error si encontramos en localStorage
      } catch {
        setError(err instanceof ApiError ? err : new Error('Error al cargar los libros'));
      }
    } finally {
      setLoading(false);
      setCartItems(cartService.get());
    }
  };

  useEffect(() => {
    reload();
    // Refrescar cada 500ms para detectar cambios en localStorage
    const interval = setInterval(() => {
      // Solo refrescar del localStorage si hay error de API
      if (error === null && books.length === 0) {
        const localBooks = bookService.getAll();
        if (localBooks.length > 0) {
          setBooks(localBooks);
        }
      }
      setCartItems(cartService.get());
    }, 500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Mostrar error si hay y no hay libros en localStorage
  if (error && books.length === 0) {
    return <ResourceError error={error} resourceName="libros" />;
  }

  // Mostrar loading
  if (loading && books.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado vacío si no hay resultados después de filtrar
  if (!loading && filtered.length === 0 && (query || category)) {
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
          </div>
        </div>
        <EmptyState
          title="No se encontraron libros"
          message={`No hay libros que coincidan con tu búsqueda "${query}"${category ? ` en la categoría "${category}"` : ''}. Intenta con otros términos de búsqueda.`}
          icon="bi-search"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-3">
          <i className="bi bi-book me-2"></i>Catálogo de Libros
        </h2>
        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Mostrando datos del almacenamiento local. La conexión con el servidor no está disponible.
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}
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
            <BookCard 
              book={b} 
              isInCart={cartItems.some(item => item.bookId === b.id)}
              userId={user?.id || null}
              onCartChange={reload}
            />
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
