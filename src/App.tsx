/**
 * Componente principal de la aplicación
 * 
 * Maneja el routing entre vista de usuario y vista de administrador,
 * similar a cómo el ERS original tenía index.html y admin.html separados.
 * 
 * El estado isAdmin se persiste en localStorage usando adminService.
 */
import { useState, useEffect } from 'react';
import { adminService } from './services/admin.service';
import { Navbar } from './ui/layout/Navbar';
import { BookList } from './ui/books/BookList';
import { LoanForm } from './ui/loans/LoanForm';
import { LoanList } from './ui/loans/LoanList';
import { AdminDashboard } from './ui/admin/AdminDashboard';
import type { Book } from './domain/book';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    // Verificar si hay sesión de admin al cargar
    setIsAdmin(adminService.isAdminLoggedIn());
  }, []);

  const handleToggleAdmin = () => {
    if (isAdmin) {
      adminService.logout();
      setIsAdmin(false);
    } else {
      adminService.login();
      setIsAdmin(true);
    }
  };

  const handleLoanCreated = () => {
    // Refrescar la vista después de crear un préstamo
    setSelectedBook(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin} />
      
      <main className="container-fluid mt-4">
        {isAdmin ? (
          // Vista de administrador (equivalente a admin.html del ERS)
          <AdminDashboard />
        ) : (
          // Vista de usuario (equivalente a index.html del ERS)
          <div className="row">
            <div className="col-lg-8">
              <h2 className="mb-4">Catálogo de Libros</h2>
              <BookList
                onSelectBook={setSelectedBook}
                showActions={true}
              />
            </div>
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '20px' }}>
                <LoanForm book={selectedBook || undefined} onLoanCreated={handleLoanCreated} />
                <div className="mt-4">
                  <h3>Mis Préstamos</h3>
                  <LoanList />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
