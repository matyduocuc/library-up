/**
 * API client para microservicio de Estudiantes
 */
import { httpClient, ApiError } from './httpClient';
import type { Student, CreateStudentDto } from '../domain/student';

export const studentApi = {
  /**
   * Obtiene todos los estudiantes
   */
  async getAll(): Promise<Student[]> {
    try {
      // Los microservicios retornan directamente el array, no en formato ApiResponse
      const response = await httpClient.get<Student[]>(
        `${httpClient.urls.students}/all`
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
   * Obtiene un estudiante por ID
   */
  async getById(id: number): Promise<Student | null> {
    try {
      const response = await httpClient.get<Student>(
        `${httpClient.urls.students}/search/${id}`
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
   * Crea un nuevo estudiante
   */
  async create(student: CreateStudentDto): Promise<void> {
    await httpClient.post<void>(
      `${httpClient.urls.students}/create`,
      student
    );
  },

  /**
   * Obtiene estudiantes por curso
   */
  async getByCourse(courseId: number): Promise<Student[]> {
    try {
      const response = await httpClient.get<Student[]>(
        `${httpClient.urls.students}/search-by-course/${courseId}`
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

