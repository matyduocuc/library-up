/**
 * API client para microservicio de Cursos
 */
import { httpClient, ApiError } from './httpClient';
import type { Course, CreateCourseDto } from '../domain/course';

export const courseApi = {
  /**
   * Obtiene todos los cursos
   */
  async getAll(): Promise<Course[]> {
    try {
      // Los microservicios retornan directamente el array, no en formato ApiResponse
      const response = await httpClient.get<Course[]>(
        `${httpClient.urls.courses}/all`
      );
      // Si es un array, retornarlo directamente
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return [];
      }
      throw error;
    }
  },

  /**
   * Obtiene un curso por ID
   */
  async getById(id: number): Promise<Course | null> {
    try {
      const response = await httpClient.get<Course>(
        `${httpClient.urls.courses}/search/${id}`
      );
      return response || null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Crea un nuevo curso
   */
  async create(course: CreateCourseDto): Promise<void> {
    await httpClient.post<void>(
      `${httpClient.urls.courses}/create`,
      course
    );
  },

  /**
   * Elimina un curso por ID
   */
  async delete(id: number): Promise<string> {
    const response = await httpClient.delete<string>(
      `${httpClient.urls.courses}/${id}`
    );
    return response || 'Eliminado';
  },

  /**
   * Obtiene los estudiantes de un curso
   */
  async getStudentsByCourse(courseId: number): Promise<Array<{ id: number; name: string; email: string }>> {
    try {
      const response = await httpClient.get<Array<{ id: number; name: string; email: string }>>(
        `${httpClient.urls.courses}/search-student/${courseId}`
      );
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return [];
      }
      throw error;
    }
  },
};

