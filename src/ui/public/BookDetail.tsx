import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { bookService } from '../../services/book.service';
import { userService } from '../../services/user.service';
import { loanService } from '../../services/loan.service';

export function BookDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const book = useMemo(() => params.id ? bookService.getById(params.id) : null, [params.id]);
  if (!book) return <p>Libro no encontrado.</p>;

  const session = userService.getSession();
  const canRequest = !!session && book.status === 'disponible';

  const request = () => {
    if (!session) { navigate('/login'); return; }
    loanService.request(session.id, book.id);
    navigate('/my-loans');
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-subtitle mb-2 text-muted">{book.author}</p>
        <p><strong>Categoría:</strong> {book.category}</p>
        <span className="badge text-bg-secondary">{book.status.toUpperCase()}</span>
        <div className="mt-3">
          <button className="btn btn-primary" disabled={!canRequest} onClick={request}>Solicitar préstamo</button>
        </div>
      </div>
    </div>
  );
}


