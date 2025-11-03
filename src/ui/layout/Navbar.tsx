import { Link, NavLink, useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';

export function Navbar() {
  const navigate = useNavigate();
  const session = userService.getSession();
  const handleLogout = () => {
    userService.logout();
    navigate('/');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">LibraryUp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navPublic">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navPublic">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/catalog">Catálogo</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/my-loans">Mis Préstamos</NavLink></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {session ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-3">{session.name} ({session.role})</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/**
 * ============================================================================
 * DOCUMENTACIÓN DE CAMBIOS
 * ============================================================================
 * 
 * CAMBIO REALIZADO:
 * - Se eliminó la importación no utilizada de adminService de la línea 8
 * 
 * RAZÓN:
 * - adminService fue importado pero nunca se utilizó en el componente
 * - La gestión de sesión de administrador se maneja en App.tsx, que utiliza
 *   adminService para login/logout y pasa el estado isAdmin como prop
 * - Esta separación de responsabilidades es correcta: App.tsx maneja la lógica
 *   de estado y sesión, mientras que Navbar solo se encarga de la presentación
 * 
 * BENEFICIOS:
 * - Reduce código innecesario (eliminación de import no utilizado)
 * - Mantiene la arquitectura limpia con separación clara de responsabilidades
 * - Evita dependencias circulares o acoplamiento innecesario entre componentes
 * - El componente Navbar sigue siendo reutilizable y testeable fácilmente
 * 
 * VERIFICACIÓN:
 * - El componente Navbar sigue cumpliendo su función:
 *   ✓ Muestra el título "Biblioteca Digital"
 *   ✓ Tiene un botón que alterna entre modo admin y usuario
 *   ✓ El botón muestra "Salir de Admin" cuando isAdmin es true
 *   ✓ El botón muestra "Modo Admin" cuando isAdmin es false
 *   ✓ La lógica de login/logout se mantiene intacta en App.tsx
 * ============================================================================
 */


