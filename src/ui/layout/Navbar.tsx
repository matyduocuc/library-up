/**
 * Componente de navegación (Navbar)
 * 
 * Barra de navegación usando Bootstrap 5 que permite cambiar entre
 * vista de usuario y vista de administrador, igual que en el ERS original
 * donde había index.html y admin.html separados.
 * 
 * El componente recibe el estado isAdmin y la función onToggleAdmin como props,
 * manteniendo la separación de responsabilidades: App.tsx maneja la lógica
 * de sesión usando adminService, y Navbar solo se encarga de la presentación.
 */
interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export function Navbar({ isAdmin, onToggleAdmin }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Biblioteca Digital
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-outline-light"
                onClick={onToggleAdmin}
              >
                {isAdmin ? 'Salir de Admin' : 'Modo Admin'}
              </button>
            </li>
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


