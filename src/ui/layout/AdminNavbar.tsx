import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

export function AdminNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link to="/admin" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-gear-fill me-2 fs-4"></i>
          <span className="fw-bold">Admin · LibraryUp</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navAdmin"
          aria-controls="navAdmin"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink end className="nav-link" to="/admin">
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/books">
                <i className="bi bi-book me-1"></i>Libros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/users">
                <i className="bi bi-people me-1"></i>Usuarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/loans">
                <i className="bi bi-journal-text me-1"></i>Préstamos
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {user && (
              <li className="nav-item">
                <span className="navbar-text me-3 d-flex align-items-center">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name}
                </span>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>Ir al sitio
              </NavLink>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

/*
Explicación:
- Navbar mejorado con iconos Bootstrap Icons para mejor identificación visual.
- Color primario (bg-primary) para diferenciar el área de administración.
- Diseño responsivo con menú colapsable.
- Botón de logout para cerrar sesión desde el panel admin.
*/


