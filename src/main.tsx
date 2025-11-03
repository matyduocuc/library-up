import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { AppRouter } from './router/AppRouter'
import { seedService } from './services/seed.service'

// Cargar datos de demo si no existen (async)
seedService.seedAll().catch(console.error)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
