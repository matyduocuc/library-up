/**
 * Configuración inicial para las pruebas de frontend
 * 
 * Este archivo se ejecuta antes de cada prueba para configurar el entorno
 * y los matchers adicionales de @testing-library/jest-dom
 */
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender expect con los matchers de jest-dom
expect.extend(matchers);

// Limpiar el DOM después de cada prueba
afterEach(() => {
  cleanup();
});


