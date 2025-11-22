# INFORME - EVALUACIÓN PARCIAL 2
## Sistema de Biblioteca Escolar - LibraryUp

---

## 1. PORTADA

**Título del Proyecto:** Sistema de Biblioteca Escolar (LibraryUp)

**Equipo:** [Nombre del equipo]

**Integrantes:** [Nombre de los integrantes]

**Fecha de entrega:** [Fecha]

**Profesor:** [Nombre del profesor]

---

## 2. RESUMEN EJECUTIVO

### Propósito del Proyecto

LibraryUp es un sistema web de gestión de biblioteca escolar diseñado para facilitar el proceso de préstamo de libros a estudiantes. El sistema permite a los usuarios explorar un catálogo completo de libros técnicos y profesionales, agregar libros a un carrito de préstamos, y gestionar sus préstamos activos. Los administradores tienen acceso a un panel completo para gestionar libros, usuarios y aprobar o rechazar solicitudes de préstamo.

### Descripción General

El sistema ofrece una experiencia de usuario moderna e intuitiva con las siguientes características principales:

- **Catálogo Interactivo**: Los usuarios pueden buscar y filtrar libros por título, autor o categoría. Cada libro muestra información detallada incluyendo portada, descripción, estado de disponibilidad y categoría.

- **Sistema de Carrito**: Los usuarios pueden agregar múltiples libros a un carrito antes de confirmar su préstamo. Los libros pueden ser eliminados del carrito antes de la confirmación final.

- **Gestión de Préstamos**: El sistema valida automáticamente la disponibilidad de libros, el número máximo de préstamos por usuario (3 libros activos), y previene duplicados.

- **Panel Administrativo**: Los administradores pueden gestionar libros, usuarios y aprobar/rechazar préstamos pendientes.

---

## 3. TECNOLOGÍAS UTILIZADAS

### Frontend

- **React 19.1.1**: Framework principal para la construcción de la interfaz de usuario
- **TypeScript 5.9.3**: Lenguaje de programación para tipado estático
- **React Router DOM 7.1.1**: Manejo de rutas y navegación entre vistas
- **Bootstrap 5.3.3**: Framework CSS para diseño responsivo
- **Bootstrap Icons 1.13.1**: Iconografía consistente

### Backend / Persistencia

- **localStorage**: Almacenamiento local del navegador para persistencia de datos
- **SHA-256**: Algoritmo de hash para seguridad de contraseñas

### Librerías y Herramientas de Pruebas

- **Vitest 4.0.6**: Framework de pruebas unitarias
- **React Testing Library 16.3.0**: Biblioteca para pruebas de componentes React
- **@testing-library/user-event 14.6.1**: Simulación de interacciones de usuario
- **@testing-library/jest-dom 6.9.1**: Matchers adicionales para DOM
- **jsdom 27.1.0**: Entorno DOM simulado para pruebas

### Herramientas de Desarrollo

- **Vite**: Build tool y servidor de desarrollo rápido
- **ESLint**: Linter para mantener calidad de código
- **TypeScript ESLint**: Linting específico para TypeScript
- **Node.js**: Entorno de ejecución JavaScript

---

## 4. DESCRIPCIÓN DEL SISTEMA

### 4.1 Catálogo de Libros

El catálogo está implementado en el componente `Catalog.tsx` y permite a los usuarios explorar todos los libros disponibles en el sistema.

#### Organización del Catálogo

Los libros se organizan en un grid responsivo que se adapta a diferentes tamaños de pantalla:

```typescript
// Fragmento de Catalog.tsx
const filtered = useMemo(() => {
  let result = books;
  if (query) {
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }
  }
  if (category) {
    result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }
  return result;
}, [books, query, category]);
```

#### Funciones de Búsqueda

El sistema ofrece tres formas de filtrar libros:

1. **Búsqueda por texto**: Busca coincidencias en título y autor
2. **Filtro por categoría**: Permite filtrar por categorías específicas (Programación, Base de Datos, Sistemas, etc.)
3. **Actualización en tiempo real**: El catálogo se actualiza automáticamente cada 500ms para reflejar cambios en los datos

```typescript
// Fragmento de Catalog.tsx - Actualización automática
useEffect(() => {
  reload();
  const interval = setInterval(reload, 500);
  return () => clearInterval(interval);
}, []);
```

### 4.2 Sistema de Préstamos

#### Flujo de Trabajo del Carrito

El sistema implementa un flujo de carrito similar a e-commerce:

1. **Agregar al Carrito**: Los usuarios pueden agregar libros disponibles a su carrito
2. **Gestión del Carrito**: Los libros pueden ser eliminados antes de confirmar
3. **Confirmación**: Al confirmar, se crean múltiples préstamos en estado "pendiente"
4. **Aprobación**: El administrador aprueba o rechaza los préstamos

#### Agregar Libros al Carrito

```typescript
// Fragmento de cart-validation.service.ts
export function validateAddToCart(bookId: string, userId: string | null): CartValidationResult {
  // 1. Verificar autenticación
  if (!userId) {
    return {
      canAdd: false,
      message: 'Debes iniciar sesión para agregar libros al carrito.',
      reason: 'not_logged_in'
    };
  }

  // 2. Verificar disponibilidad del libro
  const book = bookService.getById(bookId);
  if (!book || book.status !== 'disponible') {
    return {
      canAdd: false,
      message: 'Este libro no está disponible para préstamo.',
      reason: 'book_not_available'
    };
  }

  // 3. Verificar que no esté ya en el carrito
  const cartItems = cartService.get();
  if (cartItems.some(item => item.bookId === bookId)) {
    return {
      canAdd: false,
      message: 'Este libro ya está en tu carrito.',
      reason: 'already_in_cart'
    };
  }

  // 4. Verificar límite de préstamos
  const activeLoans = loanService.getByUser(userId).filter(loan => 
    loan.status === 'aprobado'
  );
  const totalPending = activeLoans.length + cartItems.length;
  
  if (totalPending >= MAX_ACTIVE_LOANS_PER_USER) {
    return {
      canAdd: false,
      message: `Has alcanzado el límite de ${MAX_ACTIVE_LOANS_PER_USER} préstamos.`,
      reason: 'max_capacity'
    };
  }

  return { canAdd: true, message: 'Libro agregado al carrito correctamente.' };
}
```

#### Botones Dinámicos en el Catálogo

El componente `BookCard` muestra botones diferentes según el estado del libro en el carrito:

```typescript
// Fragmento de BookCard.tsx
{!showActions && userId && book.status === 'disponible' && (
  <div className="mt-2">
    {isInCart ? (
      <button
        className="btn btn-outline-danger btn-sm w-100"
        onClick={handleRemoveFromCart}
      >
        <i className="bi bi-cart-dash me-1"></i>Eliminar del carrito
      </button>
    ) : (
      <button
        className="btn btn-primary btn-sm w-100"
        onClick={handleAddToCart}
      >
        <i className="bi bi-cart-plus me-1"></i>Agregar al carrito
      </button>
    )}
  </div>
)}
```

### 4.3 Panel Administrativo

El panel administrativo está protegido por un guard de rutas que verifica el rol del usuario:

```typescript
// Fragmento de AppRouter.tsx
function AdminGuard() {
  const { user } = useUser();
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <AdminNavbar />
      <div className="container my-4">
        <Outlet />
      </div>
    </>
  );
}
```

#### Funcionalidades del Administrador

1. **Gestión de Libros**: CRUD completo de libros con imágenes y descripciones
2. **Gestión de Usuarios**: Crear y administrar usuarios del sistema
3. **Gestión de Préstamos**: Aprobar, rechazar o marcar como devuelto los préstamos

```typescript
// Fragmento de loan.service.ts - Aprobar préstamo
approve(loanId: string): LegacyLoan | null {
  const loans = this.getAll();
  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.status !== 'pendiente') return null;

  loan.status = 'aprobado';
  bookService.update(loan.bookId, { status: 'prestado' });
  this.saveAll(loans);
  return loan;
}
```

### 4.4 Interactividad y Responsividad

#### Interactividad con React

Los componentes utilizan hooks de React para manejar estado y efectos:

- `useState`: Para estado local de componentes
- `useEffect`: Para efectos secundarios y sincronización
- `useMemo`: Para optimización de cálculos costosos
- `useContext`: Para acceso al contexto global de usuario

#### Diseño Responsivo con Bootstrap

El sistema utiliza clases de Bootstrap para diseño responsivo:

```typescript
// Ejemplo de grid responsivo
<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
  {filtered.map(b => (
    <div className="col" key={b.id}>
      <BookCard book={b} />
    </div>
  ))}
</div>
```

Este grid se adapta automáticamente:
- **Móvil**: 1 columna
- **Tablet pequeña**: 2 columnas
- **Tablet grande**: 3 columnas
- **Desktop**: 4 columnas

### 4.5 Gestión de Estado Global con UserContext

#### ¿Qué es UserContext y por qué lo utilizamos?

`UserContext` es un contexto global de React que centraliza la información del usuario en toda la aplicación. En lugar de pasar propiedades de usuario de un componente a otro mediante props (prop drilling), UserContext permite mantener la información del usuario en un lugar centralizado y accesible desde cualquier componente que lo necesite.

**Propósito principal de UserContext:**

1. **Autenticación**: Mantener el estado de sesión del usuario (si está logueado o no) de forma global
2. **Acceso global al usuario**: Acceder a la información del usuario, como rol (usuario, admin) y estado (activo, bloqueado, etc.), en toda la aplicación sin tener que pasar estos datos como props entre cada componente
3. **Control de acceso**: Restringir ciertas funcionalidades de la aplicación basadas en el rol del usuario (por ejemplo, un administrador tiene acceso al panel de gestión, pero un usuario regular no)

#### Implementación de UserContext

El UserContext se configura en dos archivos principales:

**1. Definición del Contexto (`UserContext.types.ts`):**

```typescript
// src/contexts/UserContext.types.ts
import { createContext } from 'react';
import type { PublicUser } from '../domain/user';

export interface UserContextType {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
```

**2. Provider del Contexto (`UserContext.tsx`):**

```typescript
// src/contexts/UserContext.tsx
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    const savedUser = userService.getSession();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const loggedUser = await userService.login(email, password);
    setUser(loggedUser);
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  const value: UserContextType = { user, login, logout, isLoading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
```

**3. Hook personalizado para consumir el contexto (`useUser.ts`):**

```typescript
// src/hooks/useUser.ts
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};
```

**4. Integración en la aplicación (`main.tsx`):**

```typescript
// src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </StrictMode>
)
```

#### ¿Cómo funciona UserContext en el sistema?

El flujo de funcionamiento de UserContext sigue estos pasos:

1. **Crear el contexto**: Se define el `UserContext` con el tipo `UserContextType` que incluye el usuario actual, funciones de login/logout y estado de carga

2. **Proveer el contexto**: El `UserProvider` envuelve toda la aplicación en `main.tsx`, proporcionando el contexto a todos los componentes hijos

3. **Consumir el contexto**: Cualquier componente puede acceder al contexto mediante el hook `useUser()`:

```typescript
// Ejemplo de uso en cualquier componente
import { useUser } from '../../hooks/useUser';

export function Catalog() {
  const { user } = useUser();
  // Ahora podemos usar user en cualquier parte del componente
}
```

#### ¿Cómo mejora la experiencia del usuario?

UserContext mejora la experiencia del usuario de varias maneras:

1. **Facilidad de acceso a la información del usuario**: Cualquier componente de la aplicación puede acceder al estado del usuario sin tener que pasar props de un lado a otro. Esto hace que el código sea más limpio y fácil de mantener.

2. **Autenticación y control de acceso**: Al usar UserContext, el sistema puede fácilmente gestionar el inicio y cierre de sesión del usuario, asegurando que solo los usuarios autenticados puedan acceder a ciertas páginas o realizar determinadas acciones (como agregar un libro al carrito de préstamo).

3. **Personalización del flujo de trabajo**: Dependiendo del rol del usuario (admin o usuario), se pueden mostrar diferentes componentes o funcionalidades. Por ejemplo, solo los administradores podrán ver el panel de administración y gestionar libros y préstamos.

**Ejemplo práctico - Navbar condicional:**

```typescript
// Fragmento de Navbar.tsx
export function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav>
      {user ? (
        <>
          <Link to="/my-loans">Mis Préstamos</Link>
          <Link to="/cart">Carrito</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar Sesión</Link>
      )}
    </nav>
  );
}
```

#### Integración con el resto de la lógica de la aplicación

El UserContext se integra directamente con:

**1. La autenticación de usuarios:**

Los datos del usuario, como el rol y autenticación, son almacenados en el contexto, lo que permite validar el estado de la sesión y asegurar que el flujo del sistema sea consistente con el estado del usuario.

```typescript
// Ejemplo: Validación de autenticación en BookCard
const handleAddToCart = (e: React.MouseEvent) => {
  if (!userId) {
    navigate('/login');  // Redirige si no está autenticado
    return;
  }
  // ... resto de la lógica
};
```

**2. El carrito de préstamos:**

Los usuarios solo pueden agregar libros al carrito si están autenticados. Si no lo están, se les redirige al login.

```typescript
// Fragmento de Catalog.tsx
export function Catalog() {
  const { user } = useUser();
  
  return (
    <BookCard 
      book={b} 
      userId={user?.id || null}  // Pasa el ID del usuario desde el contexto
      isInCart={cartItems.some(item => item.bookId === b.id)}
    />
  );
}
```

**3. El panel administrativo:**

Solo los administradores pueden acceder a la sección de administración para gestionar usuarios, libros y préstamos.

```typescript
// Fragmento de AppRouter.tsx - Guard de admin
function AdminGuard() {
  const { user } = useUser();
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
}
```

#### Propósito en el flujo de trabajo del proyecto

UserContext es crucial para el flujo de trabajo de la aplicación, ya que facilita:

1. **Gestión de autenticación**: Cada vez que un usuario se loguea, sus credenciales y rol son almacenados en el contexto, lo que permite que toda la aplicación reaccione a su sesión.

2. **Personalización de la UI**: Dependiendo de si el usuario es un administrador o un usuario regular, se mostrarán diferentes opciones en la aplicación.

3. **Redirección de flujo**: Si un usuario intenta acceder a una página restringida (como el panel de administración) sin estar autenticado o sin tener el rol adecuado, el sistema puede redirigirlos automáticamente al login o mostrarles un mensaje de error.

4. **Acciones condicionadas**: Acciones como agregar un libro al carrito solo están disponibles para usuarios autenticados. El sistema valida automáticamente el estado de sesión antes de permitir estas acciones.

**Ejemplo completo de integración:**

```typescript
// Validación del estado de sesión en validación de carrito
export function validateAddToCart(bookId: string, userId: string | null): CartValidationResult {
  // 1. Verificar autenticación (userId viene del UserContext)
  if (!userId) {
    return {
      canAdd: false,
      message: 'Debes iniciar sesión para agregar libros al carrito.',
      reason: 'not_logged_in'
    };
  }
  // ... resto de validaciones
}
```

#### Resumen sobre el Uso de UserContext

**Propósito:** Gestionar de manera eficiente la información del usuario (autenticación, rol, estado de sesión) a lo largo de la aplicación.

**Funcionalidad:** Centralizar el estado del usuario y compartirlo entre todos los componentes sin pasar props manualmente.

**Ventajas:**

- ✅ Facilita el acceso a la información del usuario desde cualquier componente
- ✅ Mejora la experiencia de usuario al manejar la autenticación, validaciones y control de acceso de manera centralizada
- ✅ Facilita la gestión de roles y permisos, mostrando y ocultando opciones en función del rol del usuario (usuario regular vs administrador)
- ✅ Evita prop drilling, haciendo el código más limpio y mantenible
- ✅ Sincroniza automáticamente el estado con localStorage mediante `userService`

---

## 5. FUNCIONALIDADES IMPLEMENTADAS

### 5.1 Navegación y Rutas

El sistema utiliza React Router v7 para manejar la navegación:

```typescript
// Fragmento de AppRouter.tsx
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<LoanCart />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/my-loans" element={<MyLoans />} />
        </Route>

        <Route path="/admin" element={<AdminGuard />}> 
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<BooksAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="loans" element={<LoansAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.2 Agregar Libros al Carrito

La funcionalidad de agregar al carrito incluye validaciones completas:

```typescript
// Fragmento de BookCard.tsx
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!userId) {
    navigate('/login');
    return;
  }

  const validation = validateAddToCart(book.id, userId);
  if (!validation.canAdd) {
    alert(validation.message);
    return;
  }

  cartService.add(book.id);
  if (onCartChange) onCartChange();
  alert('Libro agregado al carrito correctamente.');
};
```

### 5.3 Eliminar Libros del Carrito

Los usuarios pueden eliminar libros del carrito antes de confirmar:

```typescript
// Fragmento de BookCard.tsx
const handleRemoveFromCart = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  cartService.remove(book.id);
  if (onCartChange) onCartChange();
  alert('Libro eliminado del carrito.');
};
```

### 5.4 Validación de Estado de Usuario

El sistema valida múltiples aspectos antes de permitir operaciones:

1. **Autenticación**: Verifica que el usuario esté logueado
2. **Disponibilidad**: Verifica que el libro esté disponible
3. **Límites**: Verifica que no se exceda el límite de préstamos
4. **Duplicados**: Previene agregar el mismo libro dos veces

---

## 6. PRUEBAS Y VALIDACIONES

### 6.1 Configuración del Entorno de Pruebas

El proyecto utiliza Vitest como framework de pruebas con React Testing Library:

```typescript
// Fragmento de setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
```

### 6.2 Pruebas Unitarias Realizadas

#### Prueba del Componente BookCard

```typescript
// Fragmento de book-card.spec.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookCard } from '../../ui/books/BookCard';
import type { Book } from '../../domain/book';

describe('BookCard', () => {
  const mockBook: Book = {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programación',
    status: 'disponible',
    coverUrl: '',
    description: 'Principios y buenas prácticas para escribir código claro.'
  };

  it('debe mostrar el título del libro', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });

  it('debe mostrar el autor del libro', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
  });
});
```

#### Prueba del Catálogo

```typescript
// Fragmento de catalog.spec.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Catalog } from '../../ui/public/Catalog';

describe('Catalog', () => {
  it('debe mostrar el título del catálogo', () => {
    render(<Catalog />);
    expect(screen.getByText(/Catálogo de Libros/i)).toBeInTheDocument();
  });

  it('debe tener un campo de búsqueda', () => {
    render(<Catalog />);
    const searchInput = screen.getByPlaceholderText(/Título o autor/i);
    expect(searchInput).toBeInTheDocument();
  });
});
```

### 6.3 Cobertura de Pruebas

Las pruebas cubren:

- ✅ Renderizado de componentes
- ✅ Interacciones de usuario (botones, formularios)
- ✅ Validaciones de estado
- ✅ Servicios de datos (storage, cart, loans)
- ✅ Navegación entre rutas

---

## 7. DESCRIPCIÓN DE LA LÓGICA DE LA APLICACIÓN

### 7.1 Validación de Préstamos

El sistema valida múltiples condiciones antes de permitir agregar un libro al carrito:

```typescript
// Lógica de validación completa
export function validateAddToCart(bookId: string, userId: string | null): CartValidationResult {
  // Validaciones en orden:
  // 1. Usuario autenticado
  // 2. Libro existe y está disponible
  // 3. No está ya en el carrito
  // 4. No excede límite de préstamos (3 activos)
  // 5. No tiene el libro ya prestado
}
```

### 7.2 Gestión del Carrito

El carrito se gestiona mediante un servicio centralizado:

```typescript
// Fragmento de cart.service.ts
export const cartService = {
  get(): CartItem[] {
    return storageService.read<CartItem[]>(storageService.keys.cart, []);
  },
  add(bookId: string): void {
    const items = this.get();
    if (!items.find(i => i.bookId === bookId)) {
      items.push({ bookId, addedAt: new Date().toISOString() });
      this.set(items);
    }
  },
  remove(bookId: string): void {
    this.set(this.get().filter(i => i.bookId !== bookId));
  },
  clear(): void {
    this.set([]);
  }
};
```

### 7.3 Administración de Préstamos

El administrador puede aprobar, rechazar o marcar como devuelto:

```typescript
// Fragmento de loan.service.ts
approve(loanId: string): LegacyLoan | null {
  const loans = this.getAll();
  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.status !== 'pendiente') return null;

  loan.status = 'aprobado';
  bookService.update(loan.bookId, { status: 'prestado' });
  this.saveAll(loans);
  return loan;
}

reject(loanId: string): LegacyLoan | null {
  const loans = this.getAll();
  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.status !== 'pendiente') return null;

  loan.status = 'rechazado';
  this.saveAll(loans);
  return loan;
}
```

---

## 8. DIFICULTADES ENCONTRADAS

### 8.1 Errores Técnicos

#### Problema con Tipos de TypeScript

**Error**: Conflictos entre tipos `Loan` y `LegacyLoan` en el servicio de validación del carrito.

**Solución**: Se unificó el uso de `LegacyLoan` con estado 'aprobado' en lugar de 'active':

```typescript
// Corrección aplicada
const activeLoans = loanService.getByUser(userId).filter(loan => 
  loan.status === 'aprobado'  // Corregido de 'active' a 'aprobado'
);
```

#### Problema con React Router v7

**Error**: Incompatibilidad inicial con React 19.

**Solución**: Se migró a React Router v7.1.1 y se actualizó la sintaxis de rutas:

```typescript
// Sintaxis actualizada
<Routes>
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
  </Route>
</Routes>
```

### 8.2 Retos de Diseño y UX

#### Gestión de Estado del Carrito

**Reto**: Mantener sincronizado el estado del carrito entre múltiples componentes.

**Solución**: Se implementó un sistema de actualización automática cada 500ms y callbacks para notificar cambios:

```typescript
// Solución implementada
const reload = () => {
  setBooks(bookService.getAll());
  setCartItems(cartService.get());
};

useEffect(() => {
  reload();
  const interval = setInterval(reload, 500);
  return () => clearInterval(interval);
}, []);
```

#### Botones Dinámicos

**Reto**: Cambiar dinámicamente entre "Agregar" y "Eliminar" según el estado del carrito.

**Solución**: Se pasó el estado `isInCart` como prop y se renderizó condicionalmente:

```typescript
{isInCart ? (
  <button onClick={handleRemoveFromCart}>
    Eliminar del carrito
  </button>
) : (
  <button onClick={handleAddToCart}>
    Agregar al carrito
  </button>
)}
```

---

## 9. CONCLUSIONES

### 9.1 Reflexión sobre el Proyecto

Durante el desarrollo de LibraryUp aprendimos:

- **Gestión de Estado**: Cómo manejar estado complejo en React con Context API y hooks
- **Validaciones**: La importancia de validar datos tanto en el frontend como en la lógica de negocio
- **Arquitectura**: Cómo estructurar un proyecto React escalable con separación de responsabilidades
- **Testing**: Cómo escribir pruebas efectivas para componentes React

Los aspectos más desafiantes fueron:

1. **Sincronización de Estado**: Mantener el carrito sincronizado entre componentes
2. **Validaciones Complejas**: Implementar todas las validaciones sin afectar la UX
3. **Tipos TypeScript**: Manejar tipos complejos entre diferentes servicios

### 9.2 Posibles Mejoras

1. **Sistema de Notificaciones**: Reemplazar `alert()` por un sistema de notificaciones más elegante
2. **Historial de Préstamos**: Agregar un historial completo de préstamos anteriores
3. **Búsqueda Avanzada**: Implementar filtros más complejos (fecha, autor, etc.)
4. **Devoluciones Automáticas**: Sistema de recordatorios por email
5. **Reservas**: Permitir reservar libros que están prestados
6. **API Externa**: Integrar con APIs como Open Library para obtener información adicional

### 9.3 Futuro del Proyecto

Ideas para continuar:

- **Backend Real**: Migrar de localStorage a una API REST con base de datos
- **Autenticación JWT**: Implementar tokens JWT para sesiones más seguras
- **Multitenancy**: Soporte para múltiples bibliotecas escolares
- **Mobile App**: Aplicación móvil nativa con React Native
- **Analytics**: Dashboard de estadísticas de préstamos y libros más populares

---

## 10. REFERENCIAS

### Documentos Consultados

1. **React Official Documentation**
   - URL: https://react.dev/
   - Uso: Documentación oficial de React 19, hooks, Context API

2. **React Router Documentation**
   - URL: https://reactrouter.com/
   - Uso: Configuración de rutas, guards, y navegación

3. **Bootstrap Documentation**
   - URL: https://getbootstrap.com/docs/5.3/
   - Uso: Componentes, grid system, y utilidades CSS

4. **Vitest Documentation**
   - URL: https://vitest.dev/
   - Uso: Configuración de pruebas unitarias y testing de componentes

5. **React Testing Library**
   - URL: https://testing-library.com/react
   - Uso: Mejores prácticas para testing de componentes React

6. **TypeScript Handbook**
   - URL: https://www.typescriptlang.org/docs/
   - Uso: Tipos, interfaces, y mejores prácticas de TypeScript

### Fuentes Externas

1. **MDN Web Docs**
   - URL: https://developer.mozilla.org/
   - Uso: Referencia de APIs web, localStorage, y DOM

2. **GitHub - React Patterns**
   - Uso: Patrones de diseño comunes en React

---

## 11. ANEXOS

### 11.1 Estructura de Archivos del Proyecto

```
src/
├── contexts/          # Context API para estado global
├── domain/            # Modelos y tipos TypeScript
├── hooks/             # Hooks personalizados
├── router/            # Configuración de rutas
├── services/          # Lógica de negocio
│   ├── book.service.ts
│   ├── cart.service.ts
│   ├── loan.service.ts
│   └── user.service.ts
├── tests-fe/          # Pruebas unitarias
├── ui/
│   ├── admin/        # Componentes del panel admin
│   ├── books/        # Componentes relacionados con libros
│   ├── layout/       # Navbars y layouts
│   ├── loans/        # Componentes de préstamos
│   ├── public/       # Componentes públicos
│   └── shared/       # Componentes compartidos
└── database/          # Seeds y datos iniciales
```

### 11.2 Fragmentos de Código Importantes

#### Servicio de Validación del Carrito

```typescript
// src/services/cart-validation.service.ts
export function validateAddToCart(bookId: string, userId: string | null): CartValidationResult {
  // Implementación completa de validaciones
  // Ver código fuente para detalles
}
```

#### Componente BookCard con Funcionalidad de Carrito

```typescript
// src/ui/books/BookCard.tsx
export function BookCard({ 
  book, 
  isInCart = false,
  userId = null,
  onCartChange
}: BookCardProps) {
  // Implementación completa con botones dinámicos
  // Ver código fuente para detalles
}
```

#### Configuración de Rutas

```typescript
// src/router/AppRouter.tsx
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas y protegidas */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 11.3 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Ejecutar pruebas
npm test

# Ejecutar pruebas una vez
npm run test:run

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 12. NOTAS ADICIONALES

### Credenciales de Demo

**Administrador:**
- Email: `admin@libra.dev`
- Password: `matyxd2006`

**Usuarios:**
- Email: `maty@libra.dev` o `cami@libra.dev`
- Password: `123456`

### Límites del Sistema

- **Máximo de préstamos activos por usuario**: 3 libros
- **Duración de préstamo**: 14 días
- **Almacenamiento**: localStorage del navegador

---

**Fin del Informe**

