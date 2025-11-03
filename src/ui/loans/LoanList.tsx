/**
 * Componente LoanList (Lista de préstamos)
 * 
 * Muestra todos los préstamos. En modo admin, permite aprobar/rechazar préstamos.
 * Usa Bootstrap para tablas responsivas.
 */
import { useEffect, useState } from 'react';
import { loanService } from '../../services/loan.service';
import { bookService } from '../../services/book.service';
import { userService } from '../../services/user.service';
import type { Loan } from '../../domain/loan';

interface LoanListProps {
  isAdmin?: boolean;
  userId?: string; // Si se proporciona, muestra solo los préstamos de ese usuario
}

export function LoanList({ isAdmin = false, userId }: LoanListProps) {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    loadLoans();
  }, [userId]);

  const loadLoans = () => {
    const allLoans = userId 
      ? loanService.getByUserId(userId)
      : loanService.getAll();
    setLoans(allLoans);
  };

  const handleApprove = (loanId: string) => {
    loanService.approve(loanId);
    loadLoans();
  };

  const handleReject = (loanId: string) => {
    loanService.reject(loanId);
    loadLoans();
  };

  const handleReturn = (loanId: string) => {
    loanService.return(loanId);
    loadLoans();
  };

  const getStatusBadge = (status: Loan['status']) => {
    const classes = {
      pendiente: 'bg-warning',
      aprobado: 'bg-success',
      rechazado: 'bg-danger'
    };
    return <span className={`badge ${classes[status]}`}>{status.toUpperCase()}</span>;
  };

  if (loans.length === 0) {
    return (
      <div className="alert alert-info">
        <p>No hay préstamos registrados.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Libro</th>
            <th>Usuario</th>
            <th>Fecha de Préstamo</th>
            <th>Fecha de Devolución</th>
            <th>Estado</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => {
            const book = bookService.getById(loan.bookId);
            const user = userService.getById(loan.userId);
            
            return (
              <tr key={loan.id}>
                <td>{book?.title || 'Libro no encontrado'}</td>
                <td>{user?.name || 'Usuario no encontrado'}</td>
                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                <td>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}</td>
                <td>{getStatusBadge(loan.status)}</td>
                {isAdmin && (
                  <td>
                    {loan.status === 'pendiente' && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={() => handleApprove(loan.id)}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(loan.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {loan.status === 'aprobado' && !loan.returnDate && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Marcar Devuelto
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


