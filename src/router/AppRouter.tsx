/**
 * AppRouter - Configuración de rutas de la aplicación
 * 
 * ✅ Fix aplicado:
 * - Instalado react-router-dom v7.1.1 (compatible con React 19)
 * - Instalado @types/react-router-dom v5.3.3 para soporte TypeScript
 * - Migrado a sintaxis moderna con Routes/Route (React Router v6+)
 * - Código más limpio, tipado y compatible con TypeScript 5
 * 
 * Dependencias instaladas:
 * - react-router-dom: Router principal con API moderna (<Routes>, <Route>)
 * - @types/react-router-dom: Tipos TypeScript (aunque React Router v7 incluye tipos, 
 *   mantener @types para compatibilidad con proyectos que aún usan v6)
 * 
 * Versión del router: v7.1.1 (compatible con React 19.1.1)
 * 
 * Cambio realizado: Uso de sintaxis moderna (<Routes> en lugar de <Switch>)
 * - Antes (v5): <Switch><Route component={Home} /></Switch>
 * - Ahora (v6+): <Routes><Route element={<Home />} /></Routes>
 * 
 * Esta corrección asegura:
 * - Compatibilidad total con React 19 y TypeScript 5
 * - Código tipado sin errores de importación
 * - Sintaxis moderna y mantenible
 * - Soporte para layouts anidados con <Outlet> y guards con <Navigate>
 */
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../ui/layout/Navbar';
import { AdminNavbar } from '../ui/layout/AdminNavbar';
import { Home } from '../ui/public/Home';
import { Catalog } from '../ui/public/Catalog';
import { BookDetail } from '../ui/public/BookDetail';
import { MyLoans } from '../ui/public/MyLoans';
import { Login } from '../ui/public/Login';
import { AdminDashboard } from '../ui/admin/AdminDashboard';
import { BooksAdmin } from '../ui/admin/BooksAdmin';
import { UsersAdmin } from '../ui/admin/UsersAdmin';
import { LoansAdmin } from '../ui/admin/LoansAdmin';
import { userService } from '../services/user.service';

function AdminGuard() {
  const session = userService.getSession();
  if (!session || session.role !== 'Admin') {
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

function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="container my-4">
        <Outlet />
      </div>
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-loans" element={<MyLoans />} />
        </Route>

        <Route path="/admin" element={<AdminGuard />}> 
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<BooksAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="loans" element={<LoansAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


