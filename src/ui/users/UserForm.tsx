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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userService.add({ name, email });
    
    // Limpiar formulario
    setName('');
    setEmail('');
    
    onSave();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Agregar Usuario</h5>
      </div>
      <div className="card-body">
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
          <button type="submit" className="btn btn-primary">
            Agregar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}


