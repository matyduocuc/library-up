/**
 * Componente genérico de página de error
 * 
 * Muestra un error con título, mensaje y la URL actual que causó el error
 */
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title: string;
  message: string;
  showUrl?: boolean;
  showBackButton?: boolean;
}

export function ErrorPage({ 
  title, 
  message, 
  showUrl = true,
  showBackButton = true 
}: ErrorPageProps) {
  const navigate = useNavigate();
  const currentUrl = window.location.href;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-danger">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="card-title text-danger mb-3">{title}</h2>
              <p className="card-text text-muted mb-4">{message}</p>
              
              {showUrl && (
                <div className="alert alert-light mb-4" role="alert">
                  <small className="text-muted">
                    <strong>URL actual:</strong>
                    <br />
                    <code className="text-break">{currentUrl}</code>
                  </small>
                </div>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                {showBackButton && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-house me-2"></i>
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

