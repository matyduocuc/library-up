/**
 * Modelo de dominio para Student (Estudiante)
 * 
 * Representa un estudiante en el sistema.
 */

export interface Student {
  id: number;
  name: string;
  lastName: string;
  email: string;
  courseId: number;
}

export interface CreateStudentDto {
  name: string;
  lastName: string;
  email: string;
  courseId: number;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;

