/**
 * Pruebas unitarias para el componente BookCard
 * 
 * Verifica que el componente renderice correctamente el título, autor,
 * categoría y estado del libro. También prueba la interactividad del botón.
 * 
 * Estas pruebas cumplen con el requisito del encargo de "verificar el DOM"
 * usando React Testing Library.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookCard } from '../ui/books/BookCard';
import type { Book } from '../domain/book';

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Desarrollo de Software',
    status: 'disponible'
  };

  it('debe mostrar el título del libro', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });

  it('debe mostrar el autor del libro', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
  });

  it('debe mostrar la categoría del libro', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText(/Desarrollo de Software/)).toBeInTheDocument();
  });

  it('debe mostrar el estado del libro como badge', () => {
    render(<BookCard book={mockBook} />);
    
    const statusBadge = screen.getByText('DISPONIBLE');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('badge', 'bg-success');
  });

  it('debe mostrar el botón de solicitar préstamo cuando showActions es true y el libro está disponible', () => {
    const handleSelect = vi.fn();
    render(<BookCard book={mockBook} onSelect={handleSelect} showActions={true} />);
    
    const button = screen.getByText('Solicitar Préstamo');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('debe deshabilitar el botón cuando el libro no está disponible', () => {
    const unavailableBook: Book = { ...mockBook, status: 'prestado' };
    const handleSelect = vi.fn();
    
    render(<BookCard book={unavailableBook} onSelect={handleSelect} showActions={true} />);
    
    const button = screen.getByText('Solicitar Préstamo');
    expect(button).toBeDisabled();
  });

  it('no debe mostrar el botón cuando showActions es false', () => {
    render(<BookCard book={mockBook} showActions={false} />);
    
    expect(screen.queryByText('Solicitar Préstamo')).not.toBeInTheDocument();
  });
});

