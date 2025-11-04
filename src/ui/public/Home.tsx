import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <div className="container mb-4">
        <img
          src="https://picsum.photos/seed/librioteca-banner/1200/300"
          alt="Biblioteca - Bienvenida"
          className="img-fluid rounded shadow-sm mb-4"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-banner/1200/300';
          }}
        />
      </div>
      <div className="container py-4 text-center">
        <h1 className="display-5 fw-bold">Bienvenido a LibraryUp</h1>
        <p className="lead">Explora el catálogo de libros y nuestro nuevo catálogo de mangas.</p>
        <Link to="/catalog" className="btn btn-primary btn-lg rounded-3 shadow-sm">
          <i className="bi bi-book me-2"></i>Ir al Catálogo
        </Link>
      </div>
    </>
  );
}

/*
Explicación:
- Banner moderno con imagen temática de biblioteca usando URL estable.
- Responsivo con img-fluid y shadow-sm para mejor presentación visual.
- Fallback en caso de error de carga de imagen para mantener la experiencia.
- Botón mejorado con iconos y diseño moderno usando rounded-3 y shadow-sm.
*/


