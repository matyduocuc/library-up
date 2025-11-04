// Credenciales demo Admin (solo para desarrollo):
// Email: admin@libra.dev
// Password: matyxd2006
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email.trim(), password);
      // La redirección se maneja en el useEffect cuando user cambia
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al iniciar sesión';
      setErr(message);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h3 className="mb-4 text-center">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Iniciar sesión
          </h3>
          
          {err && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {err}
              <button type="button" className="btn-close" onClick={() => setErr(null)}></button>
            </div>
          )}

          {/* Panel de credenciales demo solo en desarrollo - oculto por defecto */}
          {import.meta.env.DEV && false && (
            <div className="alert alert-info mb-4">
              <h6 className="alert-heading">
                <i className="bi bi-info-circle me-2"></i>Credenciales de Demo
              </h6>
              <hr />
              <p className="mb-1"><strong>Admin:</strong></p>
              <ul className="mb-0 small">
                <li>Email: <code>admin@libra.dev</code></li>
                <li>Password: <code>matyxd2006</code></li>
              </ul>
              <p className="mb-1 mt-2"><strong>Usuario:</strong></p>
              <ul className="mb-0 small">
                <li>Email: <code>maty@libra.dev</code> o <code>cami@libra.dev</code></li>
                <li>Password: <code>123456</code></li>
              </ul>
            </div>
          )}

          <form onSubmit={onSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">
                <i className="bi bi-envelope me-1"></i>Email
              </label>
              <input 
                className="form-control" 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div>
              <label className="form-label">
                <i className="bi bi-lock me-1"></i>Contraseña
              </label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="••••••"
              />
            </div>
            <button className="btn btn-primary w-100 mt-2" type="submit">
              <i className="bi bi-box-arrow-in-right me-2"></i>Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/*
Explicación:
- Credenciales Admin documentadas en comentarios del código (no visibles en UI de producción).
- Panel de credenciales demo oculto por defecto (solo visible si import.meta.env.DEV && false).
- Diseño mejorado con card y alert informativo para credenciales demo.
- Redirección automática: Admin va a /admin, User a /home.
- Iconos Bootstrap Icons para mejor UX visual.
- Validación de email y contraseña con feedback visual.
- Alerta de error con botón de cierre para mejor UX.
*/


