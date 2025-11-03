# Explicaciones de la Migración a React/TypeScript

Este documento explica las decisiones de diseño y la arquitectura utilizada en la migración del sistema de biblioteca desde HTML/CSS/JS con Bootstrap a React + TypeScript.

---

## 1. Separación en `domain/` → Modelos puros sin dependencias

**¿Por qué?**

En el ERS original, las estructuras de datos estaban dispersas en el código JavaScript. Al crear la carpeta `domain/`, separamos los **modelos puros** de TypeScript que representan las entidades del negocio (Book, User, Loan).

**Beneficios:**

- **Reutilización**: Estos modelos pueden usarse tanto en frontend como en backend futuro sin cambios
- **Documentación implícita**: TypeScript actúa como documentación viva - cualquiera puede ver qué propiedades tiene un `Book`
- **Autocompletado**: Los IDE pueden sugerir propiedades automáticamente
- **Type-safety**: Evita errores de tipeo y bugs en tiempo de compilación

**Ejemplo:**
```typescript
// src/domain/book.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  // ...
}
```

Este modelo es **puro**: no depende de React, de localStorage, ni de ninguna librería externa. Es solo la definición de cómo debe verse un libro.

---

## 2. Creación de `services/` → Centralización de lógica

**¿Por qué?**

En el ERS original, el código JavaScript accedía directamente a `localStorage` en múltiples lugares, repitiendo `JSON.parse` y `JSON.stringify` una y otra vez.

**Beneficios:**

- **DRY (Don't Repeat Yourself)**: El código de localStorage está centralizado en `storage.service.ts`
- **Mantenibilidad**: Si mañana cambias de localStorage a IndexedDB o a un backend REST, solo modificas los servicios
- **Testabilidad**: Puedes hacer mocks de los servicios fácilmente en las pruebas
- **Separación de responsabilidades**: Cada servicio maneja una entidad (books, loans, users)

**Ejemplo:**
```typescript
// Antes (ERS original): repetir esto en cada función
const books = JSON.parse(localStorage.getItem('libros') || '[]');

// Ahora: una sola función reutilizable
const books = bookService.getAll();
```

**Migración futura:**

Si mañana conectas un backend, solo cambias el interior de `bookService.getAll()`:

```typescript
// Antes: localStorage
getAll(): Book[] {
  return storageService.read(storageService.keys.books, []);
}

// Después: backend
async getAll(): Promise<Book[]> {
  const response = await fetch('/api/books');
  return response.json();
}
```

Los componentes React **no necesitan cambiar** porque siguen llamando a `bookService.getAll()`.

---

## 3. UI en `ui/` → Componentes React reutilizables

**¿Por qué?**

En el ERS original, había dos archivos HTML separados (`index.html` y `admin.html`) con código duplicado. En React, cada vista es un **componente** que puede reutilizarse y componerse.

**Beneficios:**

- **Reutilización**: `BookCard` se usa tanto en la vista de usuario como en la de admin
- **Mantenibilidad**: Cada componente tiene una responsabilidad única
- **Composición**: Puedes combinar componentes pequeños para crear vistas complejas
- **Props tipadas**: TypeScript valida que pasas las props correctas

**Estructura:**
```
ui/
  layout/       → Componentes de layout (Navbar)
  books/        → Componentes relacionados con libros
  loans/        → Componentes relacionados con préstamos
  admin/        → Dashboard de administrador
  users/        → Componentes relacionados con usuarios
```

**Ejemplo:**
```tsx
// BookCard es reutilizable
<BookCard book={book} showActions={true} />

// Puede usarse en BookList o en AdminDashboard
```

---

## 4. Uso de Bootstrap 5 → Responsive Design (RF04 del ERS)

**¿Por qué?**

El ERS original especificaba usar Bootstrap para cumplir con el requisito funcional RF04 (diseño responsivo). Bootstrap 5 mantiene la misma filosofía pero con mejoras modernas.

**Beneficios:**

- **Responsive**: Las clases como `col-12 col-md-6 col-lg-4` hacen que el layout se adapte automáticamente
- **Consistencia visual**: Componentes pre-construidos (cards, tables, badges) con estilo consistente
- **Accesibilidad**: Bootstrap incluye atributos ARIA y mejores prácticas de accesibilidad
- **Familiaridad**: Si alguien conoce Bootstrap, puede entender el código inmediatamente

**Ejemplo:**
```tsx
<div className="col-12 col-md-6 col-lg-4 mb-3">
  {/* En móvil: 1 columna, tablet: 2 columnas, desktop: 3 columnas */}
  <BookCard book={book} />
</div>
```

---

## 5. Pruebas en `tests-fe/` → Cobertura de frontend

**¿Por qué?**

El encargo pide "demostrar la creación de pruebas unitarias verificando el DOM". Usamos **Vitest** + **React Testing Library** para esto.

**Beneficios:**

- **Verificación del DOM**: Las pruebas verifican que los componentes rendericen el contenido correcto
- **Interacción de usuario**: Probamos que los botones y formularios funcionen
- **Aislamiento**: Cada prueba es independiente y puede ejecutarse en cualquier orden
- **CI/CD ready**: Puedes integrar estas pruebas en pipelines de CI/CD

**Ejemplo de prueba:**
```typescript
it('debe mostrar el título del libro', () => {
  render(<BookCard book={mockBook} />);
  expect(screen.getByText('Clean Code')).toBeInTheDocument();
});
```

Esto **verifica el DOM** como pide el encargo: comprueba que el texto "Clean Code" aparezca en el documento.

**Comandos:**
```bash
npm test          # Ejecutar pruebas en modo watch
npm run test:run  # Ejecutar pruebas una vez
npm run test:ui   # Interfaz visual de Vitest
```

---

## 6. Por qué es "moderno y fácil de mantener"

### Moderno:

1. **React 19**: Framework moderno con hooks, componentes funcionales, y ecosistema robusto
2. **TypeScript**: Type-safety que previene bugs antes de ejecutar el código
3. **Vite**: Build tool moderno que es más rápido que Webpack
4. **Vitest**: Test runner moderno compatible con Vite

### Fácil de mantener:

1. **Separación de responsabilidades**: Cada archivo hace una cosa
2. **Desacoplamiento**: Los componentes no conocen localStorage directamente, solo llaman a servicios
3. **Reemplazabilidad**: Puedes cambiar de localStorage a backend sin tocar los componentes
4. **Comentarios explicativos**: Cada archivo tiene comentarios que explican **por qué** se hizo cada cosa
5. **Estructura clara**: Cualquier desarrollador puede encontrar dónde está cada cosa

### Ejemplo de desacoplamiento:

```tsx
// Componente NO sabe de localStorage
function BookList() {
  const books = bookService.getAll(); // Solo llama al servicio
  return <div>{/* render books */}</div>;
}

// Servicio abstrae el almacenamiento
export const bookService = {
  getAll() {
    return storageService.read(...); // Servicio maneja localStorage
  }
};

// Storage service abstrae la implementación
export const storageService = {
  read(key, fallback) {
    return JSON.parse(localStorage.getItem(key) || fallback);
  }
};
```

Si mañana cambias a un backend:
1. Solo modificas `bookService.getAll()` para hacer un `fetch`
2. Los componentes **no cambian**
3. `storageService` puede eliminarse o usarse solo para caché

---

## 7. Flujo de datos (igual que el ERS, pero organizado)

**ERS Original:**
```
Usuario → HTML (form) → JavaScript (función) → localStorage
```

**React/TypeScript:**
```
Usuario → React Component → Service → Storage Service → localStorage
```

El flujo es el mismo, pero ahora está **organizado en capas**:
- **UI Layer**: Componentes React (solo se preocupan de mostrar)
- **Service Layer**: Lógica de negocio (agregar, actualizar, buscar)
- **Storage Layer**: Persistencia (localStorage por ahora, backend mañana)

---

## 8. Compatibilidad con el ERS original

Todas las funcionalidades del ERS se mantienen:

✅ **Ver catálogo de libros**: `BookList` muestra todos los libros  
✅ **Simular préstamo**: `LoanForm` crea préstamos con estado 'pendiente'  
✅ **localStorage con claves**: `libros`, `usuarios`, `prestamos`, `adminSession`  
✅ **Dashboard admin**: `AdminDashboard` con gestión de libros, préstamos y usuarios  
✅ **Aprobar/rechazar préstamos**: `LoanList` con botones de aprobación  
✅ **Diseño responsive**: Bootstrap 5 con clases responsivas  
✅ **Vista usuario vs admin**: Toggle en `Navbar` que cambia entre vistas  

---

## Conclusión

Esta arquitectura respeta el ERS original pero organiza el código de forma **profesional y escalable**. Si mañana necesitas conectar un backend real, solo cambias los servicios, no los componentes. Si necesitas agregar nuevas funcionalidades, creas nuevos componentes que usan los mismos servicios.

Todo está **comentado y explicado** para que cualquier desarrollador pueda entender las decisiones de diseño.

