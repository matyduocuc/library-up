import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <div className="container mb-4">
        <img
          src="https://picsum.photos/seed/home-banner/1200/300"
          alt="Banner promocional"
          className="img-fluid rounded"
        />
      </div>
      <div className="container py-4 text-center">
        <h1 className="display-5 fw-bold">Bienvenido a LibraryUp</h1>
        <p className="lead">Explora el catálogo de libros y nuestro nuevo catálogo de mangas.</p>
        <Link to="/catalog" className="btn btn-primary btn-lg">Ir al Catálogo</Link>
      </div>
    </>
  );
}

/*
Explicación:
- El banner usa picsum con tamaño 1200×300 y clase img-fluid (Bootstrap) para ser 100% responsivo.
*/


