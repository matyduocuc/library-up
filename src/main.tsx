import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './ui/styles/clamp.css'
import './index.css'
import { AppRouter } from './router/AppRouter'
import { UserProvider } from './contexts/UserContext'
import { seedService } from './services/seed.service'
import { migrateAdminPasswordToMatyxd2006 } from './services/migrations/migrate-admin-password'

// Ejecutar seed y migración al iniciar (async)
(async () => {
  await seedService.seedAll();
  await migrateAdminPasswordToMatyxd2006();
})().catch(console.error)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </StrictMode>,
)

/*
Explicación:
- UserProvider envuelve toda la aplicación para proporcionar el contexto de usuario.
- Bootstrap CSS e Icons se importan globalmente para disponibilidad en toda la app.
- Esto ayuda a un diseño moderno y consistente sin importar en cada componente.
- La estructura sigue las mejores prácticas de React con Context API.
*/
