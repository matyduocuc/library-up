/**
 * API client para microservicio de Usuarios
 */
import { httpClient, type ApiResponse, ApiError } from './httpClient';
import type { PublicUser } from '../domain/user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserDto extends RegisterDto {
  role: 'User' | 'Admin';
}

export interface LoginResponse {
  user: PublicUser;
  token?: string;
}

export const usersApi = {
  /**
   * Inicia sesión
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      `${httpClient.urls.users}/login`,
      credentials
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterDto): Promise<PublicUser> {
    const response = await httpClient.post<ApiResponse<PublicUser>>(
      `${httpClient.urls.users}/register`,
      userData
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },

  /**
   * Obtiene todos los usuarios (solo admin)
   */
  async getAll(): Promise<PublicUser[]> {
    const response = await httpClient.get<ApiResponse<PublicUser[]>>(
      `${httpClient.urls.users}`
    );
    return response.data || [];
  },

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: string): Promise<PublicUser | null> {
    try {
      const response = await httpClient.get<ApiResponse<PublicUser>>(
        `${httpClient.urls.users}/${id}`
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
   * Crea un usuario (solo admin)
   */
  async create(userData: CreateUserDto): Promise<PublicUser> {
    const response = await httpClient.post<ApiResponse<PublicUser>>(
      `${httpClient.urls.users}`,
      userData
    );
    if (!response.data) {
      throw new Error('No se recibieron datos del servidor');
    }
    return response.data;
  },
};

