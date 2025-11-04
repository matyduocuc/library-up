import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { cartService } from '../../services/cart.service';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => setCartCount(cartService.count());
    updateCartCount();
    const interval = setInterval(updateCartCount, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-book-half me-2 fs-4"></i>
          <span className="fw-bold">LibraryUp</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navPublic"
          aria-controls="navPublic"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navPublic">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalog">
                <i className="bi bi-book me-1"></i>Catálogo
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-loans">
                  <i className="bi bi-journal-text me-1"></i>Mis Préstamos
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link position-relative" to="/cart">
                  <i className="bi bi-cart me-1"></i>
                  Carrito
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>
            )}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3 d-flex align-items-center">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name} <span className="badge bg-info ms-2">{user.role}</span>
                  </span>
                </li>
                {user.role === 'Admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <i className="bi bi-gear me-1"></i>Admin
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Crear cuenta
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/*
Explicación:
- Usa useUser hook del contexto en lugar de userService.getSession() directamente.
- El contexto actualiza automáticamente todos los componentes cuando cambia la sesión.
- Diseño moderno con iconos Bootstrap Icons para mejor UX visual.
- Navbar responsivo con menú colapsable en móviles.
- Muestra acceso directo a Admin si el usuario es administrador.
- Badge de rol para identificación rápida del tipo de usuario.
*/


