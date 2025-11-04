import { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import type { PublicUser, CreateUserDto } from '../../domain/user';

type AdminForm = {
  name: string;
  email: string;
  role: 'Admin' | 'User';
  password: string;
};

export function UsersAdmin() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [form, setForm] = useState<AdminForm>({ name: '', email: '', role: 'User', password: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reload = () => {
    const allUsers = userService.getAll();
    setUsers(allUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  };

  useEffect(() => { reload(); }, []);

  const onChange = (k: keyof AdminForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password.length < 8 && !editingId) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      if (editingId) {
        // Para editar, solo actualizamos campos públicos (sin password)
        userService.update(editingId, {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role
        });
        setSuccessMessage('Usuario actualizado correctamente.');
      } else {
        // Para crear, usamos DTO con password (el servicio genera hash)
        const dto: CreateUserDto = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password
        };
        await userService.createByAdmin(dto);
        setSuccessMessage('Usuario creado correctamente.');
      }
      
      setForm({ name: '', email: '', role: 'User', password: '' });
      setEditingId(null);
      reload();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al guardar usuario';
      alert(message);
    }
  };

  const edit = (u: PublicUser) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role, password: '' });
  };

  const remove = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      userService.remove(id);
      reload();
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>
            <i className="bi bi-people me-2"></i>Gestión de Usuarios
          </h3>
          <span className="badge bg-secondary">{users.length} usuario{users.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      className={`form-select form-select-sm ${u.role === 'Admin' ? 'border-primary' : 'border-secondary'}`}
                      value={u.role} 
                      onChange={(e)=>{
                        userService.update(u.id, { role: e.target.value as PublicUser['role']}); 
                        reload();
                      }}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2" 
                      onClick={()=>edit(u)}
                      title="Editar usuario"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={()=>remove(u.id)}
                      title="Eliminar usuario"
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
              <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {editingId ? 'Editar usuario' : 'Nuevo usuario'}
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
                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  value={form.name} 
                  onChange={onChange('name')} 
                  required 
                  minLength={2}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input 
                  className="form-control" 
                  type="email"
                  value={form.email} 
                  onChange={onChange('email')} 
                  required 
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Rol <span className="text-danger">*</span></label>
                <select 
                  className="form-select" 
                  value={form.role} 
                  onChange={onChange('role')}
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Contraseña {!editingId && <span className="text-danger">*</span>}
                </label>
                <input 
                  type="password" 
                  className="form-control"
                  value={form.password} 
                  onChange={onChange('password')} 
                  required={!editingId}
                  minLength={8}
                  placeholder={editingId ? "Dejar vacío para mantener la actual" : "Mínimo 8 caracteres"}
                />
                {!editingId && (
                  <div className="form-text">La contraseña se guardará de forma segura (hash SHA-256)</div>
                )}
              </div>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  type="submit"
                >
                  <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                  {editingId ? 'Guardar cambios' : 'Crear usuario'}
                </button>
                {editingId && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={()=>{
                      setEditingId(null); 
                      setForm({ name: '', email: '', role: 'User', password: '' });
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
- Usa CreateUserDto para crear usuarios: el servicio genera passwordHash automáticamente.
- La UI nunca construye User con passwordHash directamente.
- PublicUser se usa para mostrar en tabla (sin passwordHash).
- Al editar, solo se actualizan campos públicos (sin cambiar contraseña).
- Validación de contraseña mínima (8 caracteres) solo al crear.
- Separación clara: UI trabaja con DTOs, servicio maneja hash internamente.
*/


