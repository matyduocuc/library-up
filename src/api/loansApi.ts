/**
 * API client para microservicio de Préstamos
 * Conectado a: http://localhost:8083/api/v1/prestamos
 * NOTA: Verificar el puerto correcto (puede ser 8082 o 8083)
 */
import { httpClient, ApiError } from './httpClient';

// Re-exportar ApiError para uso en hooks
export { ApiError } from './httpClient';

export interface PrestamoDTO {
  id: number;
  usuarioId: number;
  ejemplarId: number;
  fechaPrestamo?: string;
  fechaVencimiento?: string;
  fechaDevolucion?: string;
  estado: string;
  renovaciones?: number;
}

export interface CreatePrestamoDto {
  usuarioId: number;
  ejemplarId: number;
}

export const loansApi = {
  /**
   * Obtiene un préstamo por ID
   */
  async getById(id: number): Promise<PrestamoDTO | null> {
    try {
      const data = await httpClient.get<PrestamoDTO>(`${httpClient.urls.loans}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Obtiene préstamos de un usuario
   */
  async getByUser(usuarioId: number): Promise<PrestamoDTO[]> {
    const data = await httpClient.get<PrestamoDTO[]>(`${httpClient.urls.loans}/usuario/${usuarioId}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene préstamos por estado
   */
  async getByEstado(estado: string): Promise<PrestamoDTO[]> {
    const data = await httpClient.get<PrestamoDTO[]>(`${httpClient.urls.loans}/estado/${encodeURIComponent(estado)}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Crea un nuevo préstamo
   */
  async create(loanData: CreatePrestamoDto): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}`, loanData);
  },

  /**
   * Renueva un préstamo
   */
  async renew(id: number): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}/${id}/renovar`, {});
  },

  /**
   * Devuelve un préstamo
   */
  async return(id: number): Promise<PrestamoDTO> {
    return await httpClient.post<PrestamoDTO>(`${httpClient.urls.loans}/${id}/devolver`, {});
  },
};
