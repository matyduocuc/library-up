/**
 * Tests para NotFoundPage - Verificar que muestra la URL actual
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const renderWithRouter = (initialPath: string) => {
  window.history.pushState({}, '', initialPath);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar la URL actual cuando la ruta no existe', () => {
    const testPath = '/ruta-inexistente/123';
    renderWithRouter(testPath);

    expect(screen.getByText(/Página no encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/La página que estás buscando no existe/i)).toBeInTheDocument();
    
    // Verificar que muestra la URL
    expect(screen.getByText(/URL actual:/i)).toBeInTheDocument();
    const urlElement = screen.getByText(new RegExp(testPath));
    expect(urlElement).toBeInTheDocument();
  });

  it('debe mostrar mensaje apropiado para recurso no encontrado', () => {
    renderWithRouter('/api/resource/not-found');

    // Para rutas que parecen API, podría mostrar mensaje diferente
    expect(screen.getByText(/URL actual:/i)).toBeInTheDocument();
  });

  it('debe tener botones para volver y ir al inicio', () => {
    renderWithRouter('/invalid-route');

    expect(screen.getByText(/Volver/i)).toBeInTheDocument();
    expect(screen.getByText(/Ir al inicio/i)).toBeInTheDocument();
  });

  it('debe mostrar código de URL en formato <code>', () => {
    const testPath = '/test/path/123';
    renderWithRouter(testPath);

    const codeElement = screen.getByText(new RegExp(testPath));
    expect(codeElement.tagName.toLowerCase()).toBe('code');
  });
});

