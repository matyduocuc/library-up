/**
 * Pruebas unitarias para el componente LoanForm
 * 
 * Verifica que el formulario permita seleccionar libro y usuario,
 * y que cree préstamos correctamente. También verifica la validación.
 * 
 * Estas pruebas cumplen con el requisito del encargo de "verificar el DOM"
 * y la interacción del usuario usando React Testing Library y user-event.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from '../ui/loans/LoanForm';
import { bookService } from '../services/book.service';
import { userService } from '../services/user.service';
import { loanService } from '../services/loan.service';
import type { Book } from '../domain/book';
import type { User } from '../domain/user';

// Mock de los servicios para aislar las pruebas
vi.mock('../services/book.service');
vi.mock('../services/user.service');
vi.mock('../services/loan.service');

describe('LoanForm', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Dev',
    status: 'disponible'
  };

  const mockUser: User = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com'
  };

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    
    // Configurar mocks
    vi.mocked(bookService.getAll).mockReturnValue([mockBook]);
    vi.mocked(userService.getAll).mockReturnValue([mockUser]);
    vi.mocked(loanService.create).mockReturnValue({
      id: 'loan1',
      userId: '1',
      bookId: '1',
      loanDate: new Date().toISOString(),
      status: 'pendiente'
    });
  });

  it('debe mostrar el formulario con los campos de libro y usuario', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    expect(screen.getByLabelText(/Libro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByText('Solicitar Préstamo')).toBeInTheDocument();
  });

  it('debe mostrar los libros disponibles en el select', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const bookSelect = screen.getByLabelText(/Libro/i);
    expect(bookSelect).toBeInTheDocument();
    expect(screen.getByText(/Clean Code/)).toBeInTheDocument();
  });

  it('debe mostrar los usuarios en el select', () => {
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const userSelect = screen.getByLabelText(/Usuario/i);
    expect(userSelect).toBeInTheDocument();
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  it('debe crear un préstamo cuando se completa y envía el formulario', async () => {
    const user = userEvent.setup();
    const onLoanCreated = vi.fn();
    
    render(<LoanForm onLoanCreated={onLoanCreated} />);
    
    // Seleccionar libro
    const bookSelect = screen.getByLabelText(/Libro/i);
    await user.selectOptions(bookSelect, '1');
    
    // Seleccionar usuario
    const userSelect = screen.getByLabelText(/Usuario/i);
    await user.selectOptions(userSelect, '1');
    
    // Enviar formulario
    const submitButton = screen.getByText('Solicitar Préstamo');
    await user.click(submitButton);
    
    // Verificar que se llamó al servicio de préstamos
    expect(loanService.create).toHaveBeenCalledWith('1', '1');
    expect(onLoanCreated).toHaveBeenCalled();
  });

  it('debe mostrar un mensaje de error si no se selecciona libro o usuario', async () => {
    const user = userEvent.setup();
    
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const submitButton = screen.getByText('Solicitar Préstamo');
    await user.click(submitButton);
    
    expect(screen.getByText(/Por favor, selecciona un libro y un usuario/i)).toBeInTheDocument();
    expect(loanService.create).not.toHaveBeenCalled();
  });

  it('debe mostrar un mensaje de éxito después de crear el préstamo', async () => {
    const user = userEvent.setup();
    
    render(<LoanForm onLoanCreated={vi.fn()} />);
    
    const bookSelect = screen.getByLabelText(/Libro/i);
    await user.selectOptions(bookSelect, '1');
    
    const userSelect = screen.getByLabelText(/Usuario/i);
    await user.selectOptions(userSelect, '1');
    
    const submitButton = screen.getByText('Solicitar Préstamo');
    await user.click(submitButton);
    
    expect(screen.getByText(/Préstamo solicitado exitosamente/i)).toBeInTheDocument();
  });
});


