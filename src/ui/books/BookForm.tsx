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
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [status, setStatus] = useState<'disponible' | 'prestado' | 'reservado'>('disponible');

  // Si hay un book, es modo edición: llenar el formulario con sus datos
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setDescription(book.description || '');
      setCoverUrl(book.coverUrl || '');
      setBannerUrl(book.bannerUrl || '');
      setStatus(book.status);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData = {
      title,
      author,
      category,
      description: description || 'Sin descripción',
      coverUrl: coverUrl || '/img/books/default.jpg',
      bannerUrl: bannerUrl || undefined,
      status,
    };
    
    if (book) {
      // Modo edición
      bookService.update(book.id, bookData);
    } else {
      // Modo creación
      bookService.add(bookData);
    }

    // Resetear formulario
    setTitle('');
    setAuthor('');
    setCategory('');
    setDescription('');
    setCoverUrl('');
    setBannerUrl('');
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
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="coverUrl" className="form-label">URL de Portada</label>
            <input
              type="text"
              className="form-control"
              id="coverUrl"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="/img/books/nombre.jpg"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bannerUrl" className="form-label">URL de Banner (opcional)</label>
            <input
              type="text"
              className="form-control"
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
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


