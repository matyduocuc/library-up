import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loanService } from '../../services/loan.service';
import { bookService } from '../../services/book.service';
import type { LegacyLoan } from '../../domain/loan';
import type { Book } from '../../domain/book';

interface LoanWithBook extends LegacyLoan {
  book: Book | null;
}

export function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loans, setLoans] = useState<LoanWithBook[]>([]);

  useEffect(() => {
    const loanIds = location.state?.loanIds as string[] | undefined;
    if (!loanIds || loanIds.length === 0) {
      navigate('/');
      return;
    }
    const loanData = loanIds.map(id => {
      const loan = loanService.getById(id);
      if (!loan) return null;
      const book = bookService.getById(loan.bookId);
      return { ...loan, book: book || null };
    }).filter((l): l is LoanWithBook => l !== null);
    setLoans(loanData);
  }, [location.state, navigate]);

  if (loans.length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">No se encontraron préstamos.</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Ir al inicio</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">
            <i className="bi bi-check-circle me-2" />
            Préstamos Confirmados
          </h3>
        </div>
        <div className="card-body">
          <p className="text-muted mb-4">
            Tus solicitudes de préstamo han sido registradas. Espera la aprobación del administrador.
          </p>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Autor</th>
                  <th>Fecha de préstamo</th>
                  <th>Vence</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.book?.title || loan.bookId}</td>
                    <td>{loan.book?.author || '-'}</td>
                    <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                    <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                    <td><span className="badge bg-warning">{loan.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 d-flex gap-2">
            <button className="btn btn-primary" onClick={() => navigate('/my-loans')}>
              <i className="bi bi-list-ul me-1" />
              Ir a Mis Préstamos
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/catalog')}>
              <i className="bi bi-book me-1" />
              Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Explicación:
- Muestra los loans recién creados (IDs, libros, fechas, estado pendiente).
- Botón "Ir a Mis Préstamos" para ver el historial completo.
- Proceso en dos pasos (carrito → boleta) da trazabilidad y UX clara.
*/


