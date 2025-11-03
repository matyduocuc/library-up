import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="py-5 text-center">
      <h1 className="display-5 fw-bold">Bienvenido a LibraryUp</h1>
      <p className="lead">Explora el catálogo, solicita préstamos y gestiona tu biblioteca.</p>
      <Link to="/catalog" className="btn btn-primary btn-lg">Ir al Catálogo</Link>
    </div>
  );
}


