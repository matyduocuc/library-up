/**
 * Componente BookForm (Formulario de libro)
 * 
 * Formulario para agregar o editar libros. Usado en el dashboard de administrador.
 * Usa Bootstrap para el diseño responsivo.
 */
import { useState, useEffect } from 'react';
import type { Book } from '../../domain/book';
import { bookService } from '../../services/book.service';

interface BookFormProps {
  book?: Book; // Si se proporciona, edita el libro; si no, crea uno nuevo
  onSave: () => void;
  onCancel?: () => void;
}

export function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'disponible' | 'prestado' | 'reservado'>('disponible');

  // Si hay un book, es modo edición: llenar el formulario con sus datos
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setStatus(book.status);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (book) {
      // Modo edición
      bookService.update(book.id, { title, author, category, status });
    } else {
      // Modo creación
      bookService.add({ title, author, category, status });
    }

    // Resetear formulario
    setTitle('');
    setAuthor('');
    setCategory('');
    setStatus('disponible');
    
    onSave();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">{book ? 'Editar Libro' : 'Agregar Nuevo Libro'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="form-label">Autor</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Categoría</label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Estado</label>
            <select
              className="form-select"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Book['status'])}
              required
            >
              <option value="disponible">Disponible</option>
              <option value="prestado">Prestado</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {book ? 'Actualizar' : 'Agregar'}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


