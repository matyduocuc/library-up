import { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import type { User } from '../../domain/user';

const empty: Omit<User, 'id'> = { name: '', email: '', role: 'User' };

export function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Omit<User, 'id'>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reload = () => setUsers(userService.getAll());
  useEffect(() => { reload(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) userService.update(editingId, form); else userService.add(form);
    setForm({ ...empty });
    setEditingId(null);
    reload();
  };

  const edit = (u: User) => { setEditingId(u.id); setForm({ name: u.name, email: u.email, role: u.role }); };
  const remove = (id: string) => { userService.remove(id); reload(); };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <h3>Usuarios</h3>
        <table className="table table-hover align-middle">
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select className="form-select form-select-sm" value={u.role} onChange={(e)=>{userService.update(u.id, { role: e.target.value as User['role']}); reload();}}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(u)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-lg-5">
        <h3>{editingId ? 'Editar usuario' : 'Nuevo usuario'}</h3>
        <form onSubmit={submit} className="card card-body">
          <div className="mb-2">
            <label className="form-label">Nombre</label>
            <input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select className="form-select" value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value as User['role']}))}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
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


