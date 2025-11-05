import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/book.service';
import { useUser } from '../../hooks/useUser';
import { cartService } from '../../services/cart.service';
import { resolveCover, FALLBACK_COVER, withCacheBuster } from '../shared/getCover';

export function BookDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const book = bookService.getById(id);

  if (!book) {
    return <div className="container py-4"><p className="text-muted">Libro no encontrado.</p></div>;
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    cartService.add(book.id);
    alert('Libro añadido al carrito.');
    navigate('/cart');
  };

  const cover = resolveCover(book);
  const src = cover.startsWith("/img/") ? cover : withCacheBuster(cover);

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <img
            src={src}
            alt={book.title}
            className="img-fluid rounded-3 shadow-lg"
            loading="lazy"
            referrerPolicy="no-referrer"
            style={{ objectFit: 'cover', width: '100%', maxHeight: 500 }}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src !== FALLBACK_COVER) {
                img.src = FALLBACK_COVER;
              }
            }}
          />
        </div>
        <div className="col-12 col-md-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="card-title mb-3">{book.title}</h2>
              <div className="mb-3">
                <p className="text-muted mb-2">
                  <i className="bi bi-person me-2"></i>
                  <strong>Autor:</strong> {book.author}
                </p>
                <p className="mb-2">
                  <i className="bi bi-tag me-2"></i>
                  <strong>Categoría:</strong> <span className="badge bg-info">{book.category}</span>
                </p>
                <span className={`badge ${book.status === 'disponible' ? 'bg-success' : 'bg-secondary'} mb-3`}>
                  <i className={`bi ${book.status === 'disponible' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                  {book.status === 'disponible' ? 'Disponible' : 'Prestado'}
                </span>
              </div>
              <hr />
              <div className="mb-4">
                <h5 className="mb-2">
                  <i className="bi bi-file-text me-2"></i>Descripción
                </h5>
                <p className="text-muted">{book.description}</p>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg rounded-3 shadow-sm"
                  disabled={book.status !== 'disponible'}
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2" />
                  {book.status === 'disponible' ? 'Añadir al carrito de préstamo' : 'No disponible'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
