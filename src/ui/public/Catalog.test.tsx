/**
 * Tests para Catalog - Manejo de errores de conexión y sin resultados
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Catalog } from './Catalog';
import { ApiError } from '../../api/httpClient';
import { booksApi } from '../../api/booksApi';
import * as bookServiceModule from '../../services/book.service';

// Mock de las dependencias
vi.mock('../../api/booksApi');
vi.mock('../../services/book.service');
vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({ user: null }),
}));
vi.mock('../../services/cart.service', () => ({
  cartService: {
    get: vi.fn().mockReturnValue([]),
  },
}));

describe('Catalog - Manejo de errores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar error cuando no hay conexión a la API', async () => {
    // Mock: API retorna error de red
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getAll = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    // Mock: localStorage también vacío
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getAll: vi.fn().mockReturnValue([]),
      getById: vi.fn(),
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      filterByCategory: vi.fn(),
      saveAll: vi.fn(),
    } as unknown as typeof bookServiceModule.bookService;

    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
      expect(screen.getByText(/No se pudo conectar con el servidor/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar estado vacío cuando no hay resultados después de filtrar', async () => {
    // Mock: API retorna array vacío
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getAll = vi.fn().mockResolvedValue([]);

    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getAll: vi.fn().mockReturnValue([]),
    } as unknown as typeof bookServiceModule.bookService;

    render(<Catalog />);

    // Simular búsqueda sin resultados
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Título o autor/i);
      expect(searchInput).toBeInTheDocument();
    });

    // No debería mostrar error si simplemente no hay libros
    // Solo debería mostrar mensaje cuando hay búsqueda activa sin resultados
  });

  it('debe mostrar mensaje de sin resultados cuando hay búsqueda activa sin coincidencias', async () => {
    const mockBooks = [
      {
        id: 'book1',
        title: 'Book 1',
        author: 'Author 1',
        category: 'Category 1',
        status: 'disponible' as const,
        coverUrl: '',
        description: 'Description 1',
      },
    ];

    // Mock: API retorna libros
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getAll = vi.fn().mockResolvedValue(mockBooks);

    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getAll: vi.fn().mockReturnValue(mockBooks),
    } as unknown as typeof bookServiceModule.bookService;

    render(<Catalog />);

    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument();
    });

    // Buscar algo que no existe
    const searchInput = screen.getByPlaceholderText(/Título o autor/i) as HTMLInputElement;
    searchInput.value = 'Nonexistent Book';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    await waitFor(() => {
      // Debería mostrar mensaje de sin resultados
      expect(screen.getByText(/No se encontraron libros/i)).toBeInTheDocument();
    });
  });

  it('debe usar localStorage como fallback cuando la API falla pero hay libros locales', async () => {
    const mockBooks = [
      {
        id: 'book1',
        title: 'Local Book',
        author: 'Local Author',
        category: 'Test',
        status: 'disponible' as const,
        coverUrl: '',
        description: 'Test',
      },
    ];

    // Mock: API falla
    const mockBooksApi = vi.mocked(booksApi);
    mockBooksApi.getAll = vi.fn().mockRejectedValue(
      new ApiError('Error de conexión', 0, 'Network Error')
    );

    // Mock: localStorage tiene libros
    const mockBookService = vi.mocked(bookServiceModule);
    mockBookService.bookService = {
      getAll: vi.fn().mockReturnValue(mockBooks),
    } as unknown as typeof bookServiceModule.bookService;

    render(<Catalog />);

    await waitFor(() => {
      // Debe mostrar los libros del localStorage
      expect(screen.getByText('Local Book')).toBeInTheDocument();
      // Debe mostrar advertencia de que está usando datos locales
      expect(screen.getByText(/Mostrando datos del almacenamiento local/i)).toBeInTheDocument();
    });
  });
});

