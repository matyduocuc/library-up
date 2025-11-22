/**
 * Tests para BookDetail - Manejo de errores de rutas y recursos
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookDetail } from './BookDetail';
import { ApiError } from '../../api/httpClient';
import { booksApi } from '../../api/booksApi';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias
vi.mock('../../api/booksApi');
vi.mock('../../services/book.service');
vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: { id: 'user1', name: 'Test User', role: 'User' } }),
}));
vi.mock('../../services/cart.service', () => ({
  cartService: {
    add: vi.fn(),
  },
}));

const renderWithRouter = (initialPath: string) => {
  window.history.pushState({}, '', initialPath);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('BookDetail - Manejo de errores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar error 404 cuando el libro no existe en la API', async () => {
    // Mock: API retorna 404
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getById = vi.fn().mockRejectedValue(
      new ApiError('Libro no encontrado', 404, 'Not Found')
    );

    // Mock: localStorage también retorna null
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getById: vi.fn().mockReturnValue(null),
      getAll: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      filterByCategory: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof bookServiceModule.bookService;

    renderWithRouter('/book/nonexistent-id');

    await waitFor(() => {
      expect(screen.getByText(/Libro no disponible/i)).toBeInTheDocument();
      expect(screen.getByText(/El libro que estás buscando no existe/i)).toBeInTheDocument();
    });

    // Verificar que se muestra la URL actual
    expect(screen.getByText(/URL actual:/i)).toBeInTheDocument();
  });

  it('debe mostrar error de servidor cuando la API retorna 500', async () => {
    // Mock: API retorna 500
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getById = vi.fn().mockRejectedValue(
      new ApiError('Error interno del servidor', 500, 'Internal Server Error')
    );

    // Mock: localStorage también retorna null
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getById: vi.fn().mockReturnValue(null),
      getAll: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      filterByCategory: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof bookServiceModule.bookService;

    renderWithRouter('/book/some-id');

    await waitFor(() => {
      expect(screen.getByText(/Error del servidor/i)).toBeInTheDocument();
      expect(screen.getByText(/Ocurrió un error al cargar el libro/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar error de conexión cuando no hay conexión', async () => {
    // Mock: API retorna error de red (status 0)
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getById = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    // Mock: localStorage también retorna null
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getById: vi.fn().mockReturnValue(null),
      getAll: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      filterByCategory: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof bookServiceModule.bookService;

    renderWithRouter('/book/some-id');

    await waitFor(() => {
      expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
      expect(screen.getByText(/No se pudo conectar con el servidor/i)).toBeInTheDocument();
    });
  });

  it('debe usar localStorage como fallback cuando la API falla pero hay libro local', async () => {
    const mockBook = {
      id: 'book1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      status: 'disponible' as const,
      coverUrl: '',
      description: 'Test description',
    };

    // Mock: API falla
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getById = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    // Mock: localStorage tiene el libro
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getById: vi.fn().mockReturnValue(mockBook),
      getAll: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      filterByCategory: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof bookServiceModule.bookService;

    renderWithRouter('/book/book1');

    await waitFor(() => {
      // Debe mostrar el libro del localStorage
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  it('debe mostrar la URL actual en el componente de error', async () => {
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getById = vi.fn().mockRejectedValue(
      new ApiError('Libro no encontrado', 404, 'Not Found')
    );

    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getById: vi.fn().mockReturnValue(null),
    } as unknown as typeof bookServiceModule.bookService;

    renderWithRouter('/book/invalid-id');

    await waitFor(() => {
      const urlElement = screen.getByText(/URL actual:/i);
      expect(urlElement).toBeInTheDocument();
      
      // Verificar que contiene la URL actual
      const urlCode = screen.getByText(/\/book\/invalid-id/);
      expect(urlCode).toBeInTheDocument();
    });
  });
});

