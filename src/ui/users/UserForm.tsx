/**
 * Componente UserForm (Formulario de usuario)
 * 
 * Permite agregar nuevos usuarios al sistema.
 */
import { useState } from 'react';
import { userService } from '../../services/user.service';

interface UserFormProps {
  onSave: () => void;
}

export function UserForm({ onSave }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await userService.createByAdmin({
        name,
        email,
        password: password || '123456', // Contraseña por defecto si no se proporciona
        role,
      });
      
      // Limpiar formulario
      setName('');
      setEmail('');
      setPassword('');
      setRole('User');
      
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Agregar Usuario</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Por defecto: 123456"
            />
            <small className="text-muted">Si se deja vacío, se usará "123456"</small>
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Rol</label>
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'User' | 'Admin')}
            >
              <option value="User">Usuario</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Agregar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}


