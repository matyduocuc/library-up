/**
 * Modelo de dominio para Course (Curso)
 * 
 * Representa un curso en el sistema.
 */

export interface Course {
  id: number;
  name: string;
  teacher: string;
}

export interface CreateCourseDto {
  name: string;
  teacher: string;
}

export type UpdateCourseDto = Partial<CreateCourseDto>;

