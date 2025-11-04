/**
 * Componente AdminDashboard (Dashboard de administrador)
 * 
 * Panel de control para administradores, equivalente al admin.html del ERS original.
 * Permite:
 * - Gestionar libros (agregar, editar)
 * - Gestionar usuarios (agregar)
 * - Ver y aprobar/rechazar préstamos
 */
import { useMemo } from 'react';
import { bookService } from '../../services/book.service';
import { userService } from '../../services/user.service';
import { loanService } from '../../services/loan.service';
import { DebugUsers } from '../dev/DebugUsers';

export function AdminDashboard() {
  const books = useMemo(() => bookService.getAll(), []);
  const users = useMemo(() => userService.getAll(), []);
  const loans = useMemo(() => loanService.getAll(), []);

  const totalBooks = books.length;
  const totalUsers = users.length;
  const loansByStatus = loans.reduce<Record<string, number>>((acc, l) => { acc[l.status] = (acc[l.status]||0)+1; return acc; }, {});
  const availableBooks = books.filter(b => b.status === 'disponible').length;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card text-bg-light"><div className="card-body"><div className="h5 mb-0">Libros</div><div className="display-6">{totalBooks}</div></div></div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light"><div className="card-body"><div className="h5 mb-0">Usuarios</div><div className="display-6">{totalUsers}</div></div></div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light"><div className="card-body"><div className="h5 mb-0">Disponibles</div><div className="display-6">{availableBooks}</div></div></div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light"><div className="card-body"><div className="h6 mb-2">Préstamos por estado</div>
            <div className="d-flex gap-2 flex-wrap">
              {Object.entries(loansByStatus).map(([k,v]) => (<span key={k} className="badge text-bg-secondary">{k}: {v}</span>))}
              {Object.keys(loansByStatus).length===0 && <span className="text-muted">Sin préstamos</span>}
            </div>
          </div></div>
        </div>
      </div>
      <DebugUsers />
    </div>
  );
}

