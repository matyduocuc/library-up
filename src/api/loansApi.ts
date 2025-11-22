/**
 * API client para microservicio de Préstamos
 */
import { httpClient, type ApiResponse, ApiError } from './httpClient';
import type { LegacyLoan } from '../domain/loan';

// Re-exportar ApiError para uso en hooks
export { ApiError } from './httpClient';

export interface CreateLoanDto {
  userId: string;
  bookId: string;
}

export interface CreateManyLoansDto {
  userId: string;
  bookIds: string[];
}

export const loansApi = {
  /**
   * Obtiene todos los préstamos (solo admin)
   */
  async getAll(): Promise<LegacyLoan[]> {
    const response = await httpClient.get<ApiResponse<LegacyLoan[]>>(
      `${httpClient.urls.loans}`
    );
    return response.data || [];
  },

  /**
   * Obtiene un préstamo por ID
   */
  async getById(id: string): Promise<LegacyLoan | null> {
    try {
      const response = await httpClient.get<ApiResponse<LegacyLoan>>(
        `${httpClient.urls.loans}/${id}`
      );
      return response.data || null;
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
  async getByUser(userId: string): Promise<LegacyLoan[]> {
    const response = await httpClient.get<ApiResponse<LegacyLoan[]>>(
      `${httpClient.urls.loans}/user/${userId}`
    );
    return response.data || [];
  },

  /**
   * Obtiene préstamos de un libro
   */
  async getByBook(bookId: string): Promise<LegacyLoan[]> {
    const response = await httpClient.get<ApiResponse<LegacyLoan[]>>(
      `${httpClient.urls.loans}/book/${bookId}`
    );
    return response.data || [];
  },

  /**
   * Crea una solicitud de préstamo
   */
  async create(loanData: CreateLoanDto): Promise<LegacyLoan> {
    const response = await httpClient.post<ApiResponse<LegacyLoan>>(
      `${httpClient.urls.loans}`,
      loanData
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Crea múltiples préstamos (para carrito)
   */
  async createMany(loanData: CreateManyLoansDto): Promise<LegacyLoan[]> {
    const response = await httpClient.post<ApiResponse<LegacyLoan[]>>(
      `${httpClient.urls.loans}/many`,
      loanData
    );
    return response.data || [];
  },

  /**
   * Aprueba un préstamo (solo admin)
   */
  async approve(id: string): Promise<LegacyLoan> {
    const response = await httpClient.put<ApiResponse<LegacyLoan>>(
      `${httpClient.urls.loans}/${id}/approve`,
      {}
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Rechaza un préstamo (solo admin)
   */
  async reject(id: string): Promise<LegacyLoan> {
    const response = await httpClient.put<ApiResponse<LegacyLoan>>(
      `${httpClient.urls.loans}/${id}/reject`,
      {}
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Marca un préstamo como devuelto
   */
  async returnBook(id: string): Promise<LegacyLoan> {
    const response = await httpClient.put<ApiResponse<LegacyLoan>>(
      `${httpClient.urls.loans}/${id}/return`,
      {}
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },
};

