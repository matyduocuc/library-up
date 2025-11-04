# LibraryUp - Sistema de Gestión de Biblioteca

Sistema de gestión de biblioteca desarrollado con React + TypeScript + Bootstrap.

## Características

- ✅ Gestión de libros con imágenes y descripciones
- ✅ Sistema de préstamos con carrito
- ✅ Autenticación de usuarios con Context API
- ✅ Panel de administración completo
- ✅ Persistencia en localStorage
- ✅ Diseño moderno con Bootstrap Icons

## Credenciales de Demo

**Admin:**
- Email: `admin@libra.dev`
- Password: `matyxd2006`

**Usuarios:**
- Email: `maty@libra.dev` o `cami@libra.dev`
- Password: `123456`

> **Nota:** Estas credenciales son solo para desarrollo. En producción, contacta al administrador si olvidaste tu contraseña.

## Verificación de Hash

Para verificar que los usuarios tienen hash correcto, ejecuta en la consola del navegador:

```javascript
JSON.parse(localStorage.getItem('users') || '[]').map(u => ({ 
  email: u.email, 
  hashlength: (u.passwordHash||'').length 
}))
```

Debe mostrar 64 caracteres (SHA-256 hex) por usuario.

## Limpiar Datos y Regenerar Seeds

Si necesitas limpiar datos y regenerar los seeds:

```javascript
localStorage.clear();
location.reload();
```

## Instalación

```bash
npm install
npm run dev
```

## Estructura del Proyecto

```
src/
  contexts/
    UserContext.tsx      # Contexto global de usuario
  domain/
    user.ts              # Tipos: User, PublicUser, CreateUserDto
    book.ts              # Modelo de libro
    loan.ts              # Modelo de préstamo
  services/
    user.service.ts      # Gestión de usuarios (maneja hash automáticamente)
    book.service.ts      # Gestión de libros
    loan.service.ts      # Gestión de préstamos
    crypto.util.ts       # Función SHA-256 unificada (sha256Hex)
  ui/
    admin/               # Componentes de administración
    public/              # Componentes públicos
    layout/              # Navbars y layouts
```

## Arquitectura

- **Separación de tipos:** User (interno) vs PublicUser (UI) vs CreateUserDto (creación)
- **Context API:** Gestión global de sesión sin prop drilling
- **Servicios centralizados:** Toda la lógica de negocio en servicios
- **Hash unificado:** seed y login usan la misma función sha256Hex de crypto.util

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
