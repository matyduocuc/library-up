import { useEffect, useState } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';

const categories = ['Programación', 'Base de Datos', 'Manga', 'Novela', 'Ciencia', 'Historia', 'Biografía', 'Poesía'];

const empty: Omit<Book, 'id'> = {
  title: '',
  author: '',
  category: '',
  description: '',
  coverUrl: '',
  bannerUrl: '',
  status: 'disponible'
};

export function BooksAdmin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Omit<Book, 'id'>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reload = () => setBooks(bookService.getAll());
  useEffect(() => { reload(); }, []);

  const validateForm = (): boolean => {
    return (
      form.title.trim().length >= 2 &&
      form.author.trim().length >= 2 &&
      form.category.trim().length > 0 &&
      form.description.trim().length >= 30 &&
      form.description.trim().length <= 280 &&
      /^https?:\/\//.test(form.coverUrl.trim())
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    const bookData = {
      ...form,
      coverUrl: form.coverUrl.trim(),
      bannerUrl: form.bannerUrl?.trim() || undefined,
      status: editingId ? form.status : 'disponible' as const
    };

    if (editingId) {
      bookService.update(editingId, bookData);
      setSuccessMessage('Libro actualizado correctamente.');
    } else {
      bookService.add(bookData);
      setSuccessMessage('Libro creado correctamente.');
    }
    
    setForm({ ...empty });
    setEditingId(null);
    reload();
    
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const edit = (b: Book) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      author: b.author,
      category: b.category,
      description: b.description,
      coverUrl: b.coverUrl,
      bannerUrl: b.bannerUrl || '',
      status: b.status
    });
  };

  const remove = (id: string) => { bookService.remove(id); reload(); };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>
            <i className="bi bi-book me-2"></i>Gestión de Libros
          </h3>
          <span className="badge bg-secondary">{books.length} libro{books.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
          <thead>
            <tr>
              <th>Título</th><th>Autor</th><th>Categoría</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td><strong>{b.title}</strong></td>
                <td>
                  <i className="bi bi-person me-1 text-muted"></i>
                  {b.author}
                </td>
                <td>
                  <span className="badge bg-info">{b.category}</span>
                </td>
                <td>
                  <select 
                    className={`form-select form-select-sm ${b.status === 'disponible' ? 'border-success' : 'border-secondary'}`}
                    value={b.status} 
                    onChange={(e)=>{
                      bookService.update(b.id,{ status: e.target.value as Book['status']}); 
                      reload();
                    }}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="prestado">Prestado</option>
                  </select>
                </td>
                <td className="text-end">
                  <button 
                    className="btn btn-sm btn-outline-primary me-2" 
                    onClick={()=>edit(b)}
                    title="Editar libro"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={()=>{
                      if (confirm(`¿Estás seguro de eliminar "${b.title}"?`)) {
                        remove(b.id);
                      }
                    }}
                    title="Eliminar libro"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {editingId ? 'Editar libro' : 'Nuevo libro'}
            </h4>
          </div>
          <div className="card-body">
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
              </div>
            )}
            <form onSubmit={submit}>
              <div className="mb-2">
                <label className="form-label">Título <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  value={form.title} 
                  onChange={e=>setForm(f=>({...f, title:e.target.value}))} 
                  required 
                  minLength={2}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Autor <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  value={form.author} 
                  onChange={e=>setForm(f=>({...f, author:e.target.value}))} 
                  required 
                  minLength={2}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Categoría <span className="text-danger">*</span></label>
                <select 
                  className="form-select" 
                  value={form.category} 
                  onChange={e=>setForm(f=>({...f, category:e.target.value}))} 
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">
                  Descripción <span className="text-danger">*</span>
                  <small className="text-muted ms-2">({form.description.trim().length}/280)</small>
                </label>
                <textarea 
                  className={`form-control ${form.description.trim().length > 0 && (form.description.trim().length < 30 || form.description.trim().length > 280) ? 'is-invalid' : ''}`}
                  value={form.description} 
                  onChange={e=>setForm(f=>({...f, description:e.target.value}))} 
                  required 
                  minLength={30}
                  maxLength={280}
                  rows={4}
                  placeholder="Describe el libro (30-280 caracteres)"
                />
                {form.description.trim().length > 0 && form.description.trim().length < 30 && (
                  <div className="invalid-feedback">Mínimo 30 caracteres</div>
                )}
                {form.description.trim().length > 280 && (
                  <div className="invalid-feedback">Máximo 280 caracteres</div>
                )}
              </div>
              <div className="mb-2">
                <label className="form-label">URL de Portada <span className="text-danger">*</span></label>
                <input 
                  type="url"
                  className={`form-control ${form.coverUrl.trim().length > 0 && !/^https?:\/\//.test(form.coverUrl.trim()) ? 'is-invalid' : ''}`}
                  value={form.coverUrl} 
                  onChange={e=>setForm(f=>({...f, coverUrl:e.target.value}))} 
                  required 
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {form.coverUrl.trim().length > 0 && !/^https?:\/\//.test(form.coverUrl.trim()) && (
                  <div className="invalid-feedback">Debe ser una URL válida (http:// o https://)</div>
                )}
              </div>
              {form.coverUrl && /^https?:\/\//.test(form.coverUrl.trim()) && (
                <div className="mb-2">
                  <label className="form-label">Vista previa</label>
                  <img
                    src={form.coverUrl}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/600/900';
                    }}
                    className="img-fluid rounded border"
                    style={{maxHeight: 180, objectFit: 'cover', width: '100%'}}
                    alt="Preview"
                  />
                </div>
              )}
              <div className="mb-2">
                <label className="form-label">URL de Banner (opcional)</label>
                <input 
                  type="url"
                  className="form-control"
                  value={form.bannerUrl || ''} 
                  onChange={e=>setForm(f=>({...f, bannerUrl:e.target.value}))} 
                  placeholder="https://ejemplo.com/banner.jpg"
                />
              </div>
              {editingId && (
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value as Book['status']}))}>
                    <option value="disponible">disponible</option>
                    <option value="prestado">prestado</option>
                  </select>
                </div>
              )}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={!validateForm()}
                >
                  <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                  {editingId ? 'Guardar cambios' : 'Crear libro'}
                </button>
                {editingId && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={()=>{
                      setEditingId(null); 
                      setForm({...empty});
                      setSuccessMessage(null);
                    }}
                  >
                    <i className="bi bi-x-lg me-2"></i>Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Explicación:
- Los campos nuevos (description, coverUrl, bannerUrl) enriquecen la ficha del libro y evitan tener que meter imágenes "a mano" en código.
- El refresco local mediante reload() mantiene la app reactiva sin recargar la página.
- El servicio centralizado (bookService) garantiza que el catálogo público vea el nuevo libro inmediatamente.
- Las validaciones suaves mejoran la UX: el botón se deshabilita si hay errores y muestra feedback visual.
- La previsualización de imagen permite verificar que la URL funciona antes de guardar.
- El contador de caracteres en description ayuda al usuario a cumplir los límites.
- El estado se bloquea en 'disponible' al crear para mantener consistencia de negocio.
*/


