import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useUserLoans } from '../../hooks/useUserLoans';
import { ResourceError } from '../shared/ResourceError';
import { EmptyState } from '../shared/EmptyState';

export function MyLoans() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { loans, loading, error, reload } = useUserLoans(user?.id);

  // Redirigir si no hay usuario
  if (!user) {
    navigate('/login');
    return null;
  }

  // Mostrar error si hay
  if (error && loans.length === 0) {
    return <ResourceError error={error} resourceName="préstamos" />;
  }

  // Mostrar loading
  if (loading && loans.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tus préstamos...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado vacío si no hay préstamos
  if (!loading && loans.length === 0) {
    return (
      <EmptyState
        title="No tienes préstamos registrados"
        message="Explora nuestro catálogo de libros y solicita préstamos cuando encuentres algo que te interese."
        actionLabel="Explorar catálogo"
        actionPath="/catalog"
        icon="bi-journal-text"
      />
    );
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-journal-text me-2"></i>Mis Préstamos
        </h2>
        {error && (
          <div className="alert alert-warning alert-dismissible fade show mb-0" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Mostrando datos del almacenamiento local.
            <button type="button" className="btn-close" onClick={reload}></button>
          </div>
        )}
      </div>
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


