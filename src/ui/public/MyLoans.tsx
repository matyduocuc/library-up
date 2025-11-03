import { userService } from '../../services/user.service';
import { loanService } from '../../services/loan.service';

export function MyLoans() {
  const user = userService.getSession();
  if (!user) return <p>Debes iniciar sesión para ver tus préstamos.</p>;
  const loans = loanService.getByUser(user.id);
  return (
    <div>
      <h3>Mis préstamos</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Préstamo</th>
            <th>Libro</th>
            <th>Inicio</th>
            <th>Vence</th>
            <th>Devolución</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.bookId}</td>
              <td>{new Date(l.loanDate).toLocaleDateString()}</td>
              <td>{new Date(l.dueDate).toLocaleDateString()}</td>
              <td>{l.returnDate ? new Date(l.returnDate).toLocaleDateString() : '-'}</td>
              <td><span className="badge text-bg-secondary">{l.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


