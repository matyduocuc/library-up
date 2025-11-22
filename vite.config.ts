/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
// Configuración de Vite con soporte para Vitest
// La propiedad 'test' es agregada por Vitest mediante el reference types
export default defineConfig({
  plugins: [react()],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Vitest extiende UserConfig con la propiedad test
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests-fe/setup.ts',
    css: true,
  },
} as Record<string, unknown>);
