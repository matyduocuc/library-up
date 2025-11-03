/**
 * Componente LoanForm (Formulario de préstamo)
 * 
 * Permite a los usuarios solicitar un préstamo de un libro.
 * Simula el préstamo del ERS original: crea un préstamo con estado 'pendiente'.
 */
import { useState, useEffect } from 'react';
import { loanService } from '../../services/loan.service';
import { userService } from '../../services/user.service';
import { bookService } from '../../services/book.service';
import type { Book } from '../../domain/book';
import type { User } from '../../domain/user';

interface LoanFormProps {
  book?: Book; // Libro seleccionado para préstamo
  onLoanCreated: () => void;
}

export function LoanForm({ book, onLoanCreated }: LoanFormProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(book || null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  useEffect(() => {
    // Cargar usuarios y libros disponibles
    setUsers(userService.getAll());
    setBooks(bookService.getAll().filter(b => b.status === 'disponible'));
    if (book) {
      setSelectedBook(book);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook || !selectedUserId) {
      setMessage({ type: 'danger', text: 'Por favor, selecciona un libro y un usuario' });
      return;
    }

    if (selectedBook.status !== 'disponible') {
      setMessage({ type: 'danger', text: 'Este libro no está disponible para préstamo' });
      return;
    }

    // Crear la solicitud de préstamo (pendiente, el admin lo aprobará)
    loanService.request(selectedUserId, selectedBook.id);
    
    setMessage({ type: 'success', text: 'Préstamo solicitado exitosamente. Espera aprobación del administrador.' });
    
    // Limpiar formulario
    setSelectedBook(null);
    setSelectedUserId('');
    
    // Notificar al componente padre
    onLoanCreated();
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Solicitar Préstamo</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="bookSelect" className="form-label">Libro</label>
            <select
              className="form-select"
              id="bookSelect"
              value={selectedBook?.id || ''}
              onChange={(e) => {
                const book = books.find(b => b.id === e.target.value);
                setSelectedBook(book || null);
              }}
              required
            >
              <option value="">Selecciona un libro</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} - {b.author}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="userSelect" className="form-label">Usuario</label>
            <select
              className="form-select"
              id="userSelect"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">Selecciona un usuario</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Solicitar Préstamo
          </button>
        </form>
      </div>
    </div>
  );
}


