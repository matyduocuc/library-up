import { useEffect, useState } from 'react';
import { loanService } from '../../services/loan.service';
import { userService } from '../../services/user.service';
import { bookService } from '../../services/book.service';
import type { LegacyLoan } from '../../domain/loan';

export function LoansAdmin() {
  const [loans, setLoans] = useState<LegacyLoan[]>([]);
  const reload = () => setLoans(loanService.getAll());
  useEffect(() => { reload(); }, []);

  const approve = (id: string) => { loanService.approve(id); reload(); };
  const reject = (id: string) => { loanService.reject(id); reload(); };
  const returnBook = (id: string) => { loanService.returnBook(id); reload(); };

  const getUserName = (userId: string): string => {
    const user = userService.getById(userId);
    return user ? user.name : userId;
  };

  const getBookTitle = (bookId: string): string => {
    const book = bookService.getById(bookId);
    return book ? book.title : bookId;
  };

  const getStatusBadge = (status: string): string => {
    const badges: Record<string, string> = {
      pendiente: 'bg-warning',
      aprobado: 'bg-success',
      rechazado: 'bg-danger',
      devuelto: 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  return (
    <div>
      <h3>Préstamos</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Usuario</th><th>Libro</th><th>Inicio</th><th>Vence</th><th>Devolución</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loans.map(l => (
              <tr key={l.id}>
                <td><small className="text-muted">{l.id.substring(0, 8)}...</small></td>
                <td>{getUserName(l.userId)}</td>
                <td>{getBookTitle(l.bookId)}</td>
                <td>{new Date(l.loanDate).toLocaleDateString()}</td>
                <td>{new Date(l.dueDate).toLocaleDateString()}</td>
                <td>{l.returnDate ? new Date(l.returnDate).toLocaleDateString() : '-'}</td>
                <td><span className={`badge ${getStatusBadge(l.status)}`}>{l.status}</span></td>
                <td className="text-end">
                  {l.status === 'pendiente' && (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={()=>approve(l.id)}>Aprobar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>reject(l.id)}>Rechazar</button>
                    </>
                  )}
                  {l.status === 'aprobado' && (
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>returnBook(l.id)}>Marcar devuelto</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


