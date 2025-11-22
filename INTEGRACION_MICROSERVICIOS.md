# Integración con Microservicios de Cursos y Estudiantes

## ✅ Configuración Completada

Se ha implementado la conexión entre el frontend React (`library-up`) y los microservicios de Cursos y Estudiantes.

### Archivos Creados/Modificados

#### Backend (Microservicios)
- ✅ `microservice-course/src/main/java/com/microservice/course/config/CorsConfig.java` - Configuración CORS
- ✅ `microservice-student/src/main/java/com/microservice/student/config/CorsConfig.java` - Configuración CORS
- ✅ `microservice-course/src/main/java/com/microservice/course/controller/CourseController.java` - Corregido endpoint DELETE

#### Frontend (React)
- ✅ `src/domain/course.ts` - Tipos TypeScript para Course
- ✅ `src/domain/student.ts` - Tipos TypeScript para Student
- ✅ `src/api/courseApi.ts` - Cliente API para Cursos
- ✅ `src/api/studentApi.ts` - Cliente API para Estudiantes
- ✅ `src/api/httpClient.ts` - Actualizado con URLs de Course y Student
- ✅ `.env.example` - Plantilla de variables de entorno

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto React:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_COURSES_API_URL=http://localhost:8080/api/v1/course
VITE_STUDENTS_API_URL=http://localhost:8080/api/v1/student
```

### 2. Iniciar Microservicios

```bash
# En orden:
1. microservice-config (puerto 8888)
2. microservice-eureka (puerto 8761)
3. microservice-gateway (puerto 8080)
4. microservice-course (puerto 9090)
5. microservice-student (puerto 8090)
```

### 3. Iniciar Frontend

```bash
cd library-up
npm install
npm run dev
```

## 💻 Uso en Componentes React

### Ejemplo Básico

```typescript
import { courseApi } from '../api/courseApi';
import { studentApi } from '../api/studentApi';
import { useState, useEffect } from 'react';

function CoursesComponent() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await courseApi.getAll();
        setCourses(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadCourses();
  }, []);

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.name}</h3>
          <p>Profesor: {course.teacher}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📚 Documentación Completa

Para más detalles, consulta:
- `CONEXION_REACT.md` en el proyecto de microservicios
- `DOCUMENTO_CONEXIONES_API.md` en este proyecto

## 🔗 Endpoints Disponibles

### Cursos
- `GET /api/v1/course/all` - Listar todos
- `GET /api/v1/course/search/{id}` - Obtener por ID
- `POST /api/v1/course/create` - Crear curso
- `DELETE /api/v1/course/{id}` - Eliminar curso
- `GET /api/v1/course/search-student/{idCourse}` - Estudiantes del curso

### Estudiantes
- `GET /api/v1/student/all` - Listar todos
- `GET /api/v1/student/search/{id}` - Obtener por ID
- `POST /api/v1/student/create` - Crear estudiante
- `GET /api/v1/student/search-by-course/{courseId}` - Por curso

