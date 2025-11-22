/**
 * API client para microservicio de Informes
 * Conectado a: http://localhost:8085/api/informes
 */
import { httpClient } from './httpClient';

export interface PrestamosResumenDTO {
  totalPrestamos: number;
  activos: number;
  atraso: number;
  devueltos: number;
  cancelados: number;
  perdidos: number;
  multasPendientes: number;
  multasPagadas: number;
}

export interface UsuarioResumenDTO {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  totalPrestamos: number;
  prestamosActivos: number;
  prestamosAtraso: number;
  multasPendientes: number;
}

export interface MultasResumenDTO {
  totalMultas: number;
  multasPendientes: number;
  multasPagadas: number;
  multasExentas: number;
}

export const reportsApi = {
  /**
   * Obtiene resumen de préstamos
   */
  async getPrestamosResumen(): Promise<PrestamosResumenDTO> {
    return await httpClient.get<PrestamosResumenDTO>(`${httpClient.urls.reports}/prestamos/resumen`);
  },

  /**
   * Obtiene resumen de un usuario específico
   */
  async getUsuarioResumen(usuarioId: number): Promise<UsuarioResumenDTO> {
    return await httpClient.get<UsuarioResumenDTO>(`${httpClient.urls.reports}/usuarios/${usuarioId}/resumen`);
  },

  /**
   * Obtiene resumen de multas
   */
  async getMultasResumen(): Promise<MultasResumenDTO> {
    return await httpClient.get<MultasResumenDTO>(`${httpClient.urls.reports}/multas/resumen`);
  },
};

