/**
 * Componente AdminDashboard (Dashboard de administrador)
 * 
 * Panel de control para administradores, equivalente al admin.html del ERS original.
 * Permite:
 * - Gestionar libros (agregar, editar)
 * - Gestionar usuarios (agregar)
 * - Ver y aprobar/rechazar préstamos
 */
import { useState } from 'react';
import { BookList } from '../books/BookList';
import { BookForm } from '../books/BookForm';
import { LoanList } from '../loans/LoanList';
import { UserForm } from '../users/UserForm';
import { UserList } from '../users/UserList';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'books' | 'loans' | 'users'>('books');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Panel de Administración</h1>
      
      {/* Tabs de Bootstrap */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Libros
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            Préstamos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
        </li>
      </ul>

      {/* Contenido de las tabs */}
      <div className="tab-content">
        {activeTab === 'books' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <BookForm onSave={handleRefresh} />
            </div>
            <div className="col-md-8">
              <h3>Catálogo de Libros</h3>
              <BookList key={refreshKey} />
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div>
            <h3>Gestión de Préstamos</h3>
            <LoanList isAdmin={true} />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <UserForm onSave={handleRefresh} />
            </div>
            <div className="col-md-8">
              <h3>Usuarios Registrados</h3>
              <UserList key={refreshKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

