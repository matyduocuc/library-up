/**
 * API client para microservicio de Usuarios
 * Conectado a: http://localhost:8081/api/usuarios
 */
import { httpClient, ApiError } from './httpClient';

export interface UsuarioDTO {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: {
    calle?: string;
    numero?: string;
    departamento?: string;
    codigoPostal?: string;
    comuna?: string;
    region?: string;
  };
  roles: string[];
  activo: boolean;
  fechaCreacion?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  nombre: string;
  rut: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UsuarioCreateRequest {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: {
    calle?: string;
    numero?: string;
    departamento?: string;
    codigoPostal?: string;
    comunaNombre?: string;
  };
}

export const usersApi = {
  /**
   * Inicia sesión
   * Endpoint: POST /api/auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // El endpoint de login retorna AuthResponse directamente, no en formato ApiResponse
    return await httpClient.post<AuthResponse>(
      `http://localhost:8081/api/auth/login`,
      credentials
    );
  },

  /**
   * Obtiene todos los usuarios (solo admin)
   */
  async getAll(): Promise<UsuarioDTO[]> {
    const data = await httpClient.get<UsuarioDTO[]>(`${httpClient.urls.users}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: number): Promise<UsuarioDTO | null> {
    try {
      const data = await httpClient.get<UsuarioDTO>(`${httpClient.urls.users}/${id}`);
      return data || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Crea un usuario
   */
  async create(userData: UsuarioCreateRequest): Promise<UsuarioDTO> {
    return await httpClient.post<UsuarioDTO>(`${httpClient.urls.users}`, userData);
  },

  /**
   * Actualiza un usuario
   */
  async update(id: number, userData: UsuarioCreateRequest): Promise<UsuarioDTO> {
    return await httpClient.put<UsuarioDTO>(`${httpClient.urls.users}/${id}`, userData);
  },

  /**
   * Elimina un usuario (solo admin)
   */
  async delete(id: number): Promise<void> {
    await httpClient.delete<void>(`${httpClient.urls.users}/${id}`);
  },

  /**
   * Activa un usuario (solo admin)
   */
  async activate(id: number): Promise<void> {
    await httpClient.patch<void>(`${httpClient.urls.users}/${id}/activar`, {});
  },

  /**
   * Desactiva un usuario (solo admin)
   */
  async deactivate(id: number): Promise<void> {
    await httpClient.patch<void>(`${httpClient.urls.users}/${id}/desactivar`, {});
  },
};
