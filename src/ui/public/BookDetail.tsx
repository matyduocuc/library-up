import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/book.service';
import { userService } from '../../services/user.service';
import { loanService } from '../../services/loan.service';

export function BookDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const book = bookService.getById(id);

  if (!book) {
    return <div className="container py-4"><p className="text-muted">Libro no encontrado.</p></div>;
  }

  const handleRequest = () => {
    const session = userService.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    loanService.request(session.id, book.id);
    alert('Solicitud enviada (estado: pendiente).');
    navigate('/my-loans');
  };

  return (
    <div className="container py-4">
      {book.bannerUrl && (
        <img src={book.bannerUrl} alt="Banner" className="img-fluid rounded mb-3" />
      )}
      <div className="row">
        <div className="col-12 col-md-4">
          {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="img-fluid rounded" />}
        </div>
        <div className="col-12 col-md-8">
          <h2 className="mb-2">{book.title}</h2>
          <p className="text-muted mb-2">{book.author}</p>
          {book.description && <p className="mb-3">{book.description}</p>}
          <p className="mb-2"><small className="text-muted"><strong>Categoría:</strong> {book.category}</small></p>
          <span className={`badge ${book.status === 'disponible' ? 'bg-success' : 'bg-secondary'} mb-3`}>
            {book.status.toUpperCase()}
          </span>
          <div>
            <button
              className="btn btn-primary"
              disabled={book.status !== 'disponible'}
              onClick={handleRequest}
            >
              {book.status === 'disponible' ? 'Solicitar préstamo' : 'No disponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Explicación:
- Extrae el libro por id y muestra portada + banner + descripción.
- El botón "Solicitar préstamo" redirige a /login si no hay sesión.
*/


