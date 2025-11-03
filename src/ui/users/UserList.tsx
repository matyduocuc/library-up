/**
 * Componente UserList (Lista de usuarios)
 * 
 * Muestra todos los usuarios registrados en el sistema.
 * Usado en el dashboard de administrador.
 */
import { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import type { User } from '../../domain/user';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(userService.getAll());
  }, []);

  if (users.length === 0) {
    return (
      <div className="alert alert-info">
        <p>No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

