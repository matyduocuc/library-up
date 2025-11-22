/**
 * Componente para mostrar estados vacíos (sin resultados, sin préstamos, etc.)
 * 
 * Diferente de errores: muestra información cuando no hay datos pero no hay error
 */
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
  icon?: string;
}

export function EmptyState({ 
  title, 
  message, 
  actionLabel,
  actionPath,
  icon = 'bi-inbox'
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="mb-4">
            <i className={`bi ${icon} text-muted`} style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="mb-3">{title}</h3>
          <p className="text-muted mb-4">{message}</p>
          {actionLabel && actionPath && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(actionPath)}
            >
              <i className="bi bi-arrow-right me-2"></i>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

