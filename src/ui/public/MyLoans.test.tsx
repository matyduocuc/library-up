/**
 * Tests para MyLoans - Manejo de errores de API y rutas
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MyLoans } from './MyLoans';
import { ApiError } from '../../api/httpClient';
import { loansApi } from '../../api/loansApi';
import * as loanServiceModule from '../../services/loan.service';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias
vi.mock('../../api/loansApi');
vi.mock('../../services/loan.service');
vi.mock('../../services/book.service');

const mockUser = { id: 'user1', name: 'Test User', role: 'User' as const };

vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: mockUser }),
}));

const renderWithRouter = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/my-loans" element={<MyLoans />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('MyLoans - Manejo de errores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/my-loans');
  });

  it('debe mostrar error cuando la API retorna 404', async () => {
    // Mock: API retorna 404
    const mockLoansApi = vi.mocked(loansApi);
    mockLoansApi.getByUser = vi.fn().mockRejectedValue(
      new ApiError('Préstamos no encontrados', 404, 'Not Found')
    );

    // Mock: localStorage también vacío
    const mockLoanService = vi.mocked(loanServiceModule);
    mockLoanService.loanService = {
      getByUser: vi.fn().mockReturnValue([]),
      getAll: vi.fn(),
      getById: vi.fn(),
      getByBookId: vi.fn(),
      request: vi.fn(),
      requestMany: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
      returnBook: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof loanServiceModule.loanService;

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Préstamos no disponible/i)).toBeInTheDocument();
      expect(screen.getByText(/El préstamos que estás buscando no existe/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar error de servidor cuando la API retorna 500', async () => {
    // Mock: API retorna 500
    const mockLoansApi = vi.mocked(loansApi);
    mockLoansApi.getByUser = vi.fn().mockRejectedValue(
      new ApiError('Error interno del servidor', 500, 'Internal Server Error')
    );

    // Mock: localStorage también vacío
    const mockLoanService = vi.mocked(loanServiceModule);
    mockLoanService.loanService = {
      getByUser: vi.fn().mockReturnValue([]),
      getAll: vi.fn(),
      getById: vi.fn(),
      getByBookId: vi.fn(),
      request: vi.fn(),
      requestMany: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
      returnBook: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof loanServiceModule.loanService;

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Error del servidor/i)).toBeInTheDocument();
      expect(screen.getByText(/Ocurrió un error al cargar el préstamos/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar estado vacío cuando no hay préstamos pero no hay error', async () => {
    // Mock: API retorna array vacío
    const mockLoansApi = vi.mocked(loansApi);
    mockLoansApi.getByUser = vi.fn().mockResolvedValue([]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No tienes préstamos registrados/i)).toBeInTheDocument();
      expect(screen.getByText(/Explorar catálogo/i)).toBeInTheDocument();
    });
  });

  it('debe usar localStorage como fallback cuando la API falla pero hay préstamos locales', async () => {
    const mockLoans = [
      {
        id: 'loan1',
        userId: 'user1',
        bookId: 'book1',
        loanDate: '2024-01-01',
        dueDate: '2024-01-15',
        status: 'aprobado' as const,
      },
    ];

    const mockBook = {
      id: 'book1',
      title: 'Test Book',
      author: 'Test Author',
      category: 'Test',
      status: 'prestado' as const,
      coverUrl: '',
      description: 'Test',
    };

    // Mock: API falla
    const mockLoansApi = vi.mocked(loansApi);
    mockLoansApi.getByUser = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    // Mock: localStorage tiene préstamos
    const mockLoanService = vi.mocked(loanServiceModule);
    mockLoanService.loanService = {
      getByUser: vi.fn().mockReturnValue(mockLoans),
      getAll: vi.fn(),
      getById: vi.fn(),
      getByBookId: vi.fn(),
      request: vi.fn(),
      requestMany: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
      returnBook: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof loanServiceModule.loanService;

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

    renderWithRouter();

    await waitFor(() => {
      // Debe mostrar los préstamos del localStorage
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('debe mostrar la URL actual cuando hay error', async () => {
    const mockLoansApi = vi.mocked(loansApi);
    mockLoansApi.getByUser = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    const mockLoanService = vi.mocked(loanServiceModule);
    mockLoanService.loanService = {
      getByUser: vi.fn().mockReturnValue([]),
    } as unknown as typeof loanServiceModule.loanService;

    renderWithRouter();

    await waitFor(() => {
      const urlElement = screen.getByText(/URL actual:/i);
      expect(urlElement).toBeInTheDocument();
    });
  });
});

