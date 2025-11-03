import { Link, NavLink } from 'react-router-dom';

export function AdminNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link to="/admin" className="navbar-brand">Admin · LibraryUp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAdmin">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink end className="nav-link" to="/admin">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin/books">Libros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin/users">Usuarios</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin/loans">Préstamos</NavLink></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Ir al sitio</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


