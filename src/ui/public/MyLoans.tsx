import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { loanService } from '../../services/loan.service';
import { bookService } from '../../services/book.service';
import type { LegacyLoan } from '../../domain/loan';
import type { Book } from '../../domain/book';

interface LoanWithBook extends LegacyLoan {
  book: Book | null;
}

export function MyLoans() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loans, setLoans] = useState<LoanWithBook[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userLoans = loanService.getByUser(user.id);
    const loansWithBooks: LoanWithBook[] = userLoans.map(loan => {
      const book = bookService.getById(loan.bookId);
      return {
        ...loan,
        book: book || null
      };
    });
    setLoans(loansWithBooks);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pendiente: 'bg-warning',
      aprobado: 'bg-success',
      rechazado: 'bg-danger',
      devuelto: 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  if (loans.length === 0) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">
          <i className="bi bi-journal-text me-2"></i>Mis Préstamos
        </h2>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No tienes préstamos registrados.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
          <i className="bi bi-book me-1"></i>Explorar catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        <i className="bi bi-journal-text me-2"></i>Mis Préstamos
      </h2>
      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th><i className="bi bi-book me-1"></i>Libro</th>
              <th><i className="bi bi-person me-1"></i>Autor</th>
              <th><i className="bi bi-calendar-event me-1"></i>Fecha de préstamo</th>
              <th><i className="bi bi-calendar-check me-1"></i>Fecha de vencimiento</th>
              <th><i className="bi bi-calendar-x me-1"></i>Fecha de devolución</th>
              <th><i className="bi bi-info-circle me-1"></i>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td>
                  <strong>{loan.book?.title || loan.bookId}</strong>
                </td>
                <td className="text-muted">{loan.book?.author || '-'}</td>
                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                <td>
                  <span className={new Date(loan.dueDate) < new Date() && loan.status !== 'devuelto' ? 'text-danger fw-bold' : ''}>
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </span>
                </td>
                <td>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`badge ${getStatusBadge(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*
Explicación:
- Muestra préstamos del usuario con información completa del libro.
- Badges de estado con colores (pendiente=amarillo, aprobado=verde, etc.).
- Redirige al login si no hay sesión activa.
- Fechas de vencimiento en rojo si están vencidas y no devueltas.
- Mensaje amigable si no hay préstamos.
*/


