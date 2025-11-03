import { useEffect, useState } from 'react';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';

const empty: Omit<Book, 'id'> = { title: '', author: '', category: '', status: 'disponible' };

export function BooksAdmin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Omit<Book, 'id'>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = () => setBooks(bookService.getAll());
  useEffect(() => { reload(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      bookService.update(editingId, form);
    } else {
      bookService.add(form);
    }
    setForm({ ...empty });
    setEditingId(null);
    reload();
  };

  const edit = (b: Book) => {
    setEditingId(b.id);
    setForm({ title: b.title, author: b.author, category: b.category, status: b.status });
  };

  const remove = (id: string) => { bookService.remove(id); reload(); };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <h3>Libros</h3>
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Título</th><th>Autor</th><th>Categoría</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>
                  <select className="form-select form-select-sm" value={b.status} onChange={(e)=>{bookService.update(b.id,{ status: e.target.value as Book['status']}); reload();}}>
                    <option value="disponible">disponible</option>
                    <option value="prestado">prestado</option>
                    <option value="mantenimiento">mantenimiento</option>
                  </select>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(b)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(b.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-lg-5">
        <h3>{editingId ? 'Editar libro' : 'Nuevo libro'}</h3>
        <form onSubmit={submit} className="card card-body">
          <div className="mb-2">
            <label className="form-label">Título</label>
            <input className="form-control" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Autor</label>
            <input className="form-control" value={form.author} onChange={e=>setForm(f=>({...f, author:e.target.value}))} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Categoría</label>
            <input className="form-control" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f, status:e.target.value as Book['status']}))}>
              <option value="disponible">disponible</option>
              <option value="prestado">prestado</option>
              <option value="mantenimiento">mantenimiento</option>
            </select>
          </div>
          <div>
            <button className="btn btn-primary me-2" type="submit">{editingId ? 'Guardar' : 'Crear'}</button>
            {editingId && <button className="btn btn-secondary" type="button" onClick={()=>{setEditingId(null); setForm({...empty});}}>Cancelar</button>}
          </div>
        </form>
      </div>
    </div>
  );
}


