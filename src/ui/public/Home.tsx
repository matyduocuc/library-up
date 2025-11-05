import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <div className="container mb-4">
        <img
          src="https://picsum.photos/seed/biblioteca-moderna-atractiva/1200/300"
          alt="Biblioteca - Bienvenida"
          className="img-fluid rounded shadow-sm mb-4"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-banner/1200/300';
          }}
        />
      </div>
      <div className="container py-4 text-center">
        <h1 className="display-5 fw-bold">Bienvenido a LibraryUp</h1>
        <p className="lead">Explora el catálogo de libros técnicos y profesionales.</p>
      </div>

      {/* Sección "¿Quiénes somos?" */}
      <section id="who-we-are" className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center display-6 fw-semibold mb-4">
                <i className="bi bi-info-circle me-2"></i>¿Quiénes somos?
              </h2>
              <div className="text-center text-muted">
                <p className="fs-5 mb-4">
                  En <span className="fw-bold text-primary">LibraryUp</span>, creemos en el poder del conocimiento y el aprendizaje. Nuestra misión es brindarte acceso a una gran variedad de libros técnicos y profesionales para que puedas disfrutar del mundo literario desde cualquier lugar y en cualquier momento.
                </p>
                <p className="fs-5 mb-4">
                  Ofrecemos un catálogo diverso de libros, desde los más recientes hasta los clásicos atemporales, todos disponibles para su préstamo fácil y rápido. Nuestro objetivo es ayudarte a encontrar el libro perfecto para <strong>tu crecimiento personal, académico y profesional</strong>.
                </p>
                <p className="fs-5 mb-4">
                  <strong>¿Por qué elegirnos?</strong> Además de nuestra amplia selección de títulos, en LibraryUp tendrás una experiencia personalizada: podrás solicitar tus libros directamente en línea, con opciones de entrega cómoda y segura, sin complicaciones.
                </p>
                <p className="fs-5 mb-4">
                  <i className="bi bi-stars text-warning me-2"></i>
                  <strong>¡Visítanos y comienza a explorar hoy mismo!</strong>
                </p>
                <Link to="/catalog" className="btn btn-primary btn-lg rounded-3 shadow-sm mt-3">
                  <i className="bi bi-search me-2"></i>Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/*
Explicación:
- Banner moderno con imagen temática de biblioteca usando URL estable.
- Responsivo con img-fluid y shadow-sm para mejor presentación visual.
- Fallback en caso de error de carga de imagen para mantener la experiencia.
- Sección "¿Quiénes somos?" con fondo claro (bg-light) para destacar el contenido.
- Texto centrado y bien estructurado que explica la misión y beneficios de LibraryUp.
- Un solo botón de acción "Explorar Catálogo" en la sección "¿Quiénes somos?" para evitar redundancia.
- Diseño responsivo que se adapta a diferentes tamaños de pantalla.
*/


