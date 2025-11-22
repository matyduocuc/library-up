# Configuración de API y Microservicios

## Variables de Entorno

Para conectar el frontend con los microservicios Spring Boot, crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL base de la API (puerto por defecto del API Gateway o servicio principal)
VITE_API_BASE_URL=http://localhost:8080

# URLs específicas de cada microservicio (opcionales)
# Si no se definen, usarán API_BASE_URL + ruta por defecto
VITE_BOOKS_API_URL=http://localhost:8081/api/books
VITE_USERS_API_URL=http://localhost:8082/api/users
VITE_LOANS_API_URL=http://localhost:8083/api/loans
```

## Configuración de Puertos

Si tus microservicios usan puertos diferentes, ajusta las URLs:

- **Microservicio de Libros**: puerto 8081
- **Microservicio de Usuarios**: puerto 8082
- **Microservicio de Préstamos**: puerto 8083

O si usas un API Gateway:

```env
VITE_API_BASE_URL=http://localhost:8080
# Todas las rutas pasarán por el gateway
```

## Configuración de CORS en Spring Boot

Asegúrate de que cada microservicio tenga configurado CORS para permitir el frontend:

```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
```

O en una configuración global:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

## Fallback a localStorage

El sistema está diseñado para funcionar con o sin backend:

1. **Con backend**: Intenta primero conectarse a la API
2. **Sin backend o error**: Automáticamente usa localStorage como fallback
3. **Híbrido**: Puede funcionar con ambos simultáneamente

Esto permite desarrollo y pruebas sin necesidad de tener todos los microservicios corriendo.

## Estructura de la API

### Libros (`/api/books`)
- `GET /api/books` - Listar todos los libros
- `GET /api/books/:id` - Obtener un libro por ID
- `POST /api/books` - Crear un libro
- `PUT /api/books/:id` - Actualizar un libro
- `DELETE /api/books/:id` - Eliminar un libro
- `GET /api/books/search?q=...` - Buscar libros
- `GET /api/books?category=...` - Filtrar por categoría

### Usuarios (`/api/users`)
- `POST /api/users/login` - Iniciar sesión
- `POST /api/users/register` - Registrar usuario
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario (admin)

### Préstamos (`/api/loans`)
- `GET /api/loans` - Listar todos los préstamos (admin)
- `GET /api/loans/:id` - Obtener préstamo por ID
- `GET /api/loans/user/:userId` - Préstamos de un usuario
- `GET /api/loans/book/:bookId` - Préstamos de un libro
- `POST /api/loans` - Crear préstamo
- `POST /api/loans/many` - Crear múltiples préstamos
- `PUT /api/loans/:id/approve` - Aprobar préstamo (admin)
- `PUT /api/loans/:id/reject` - Rechazar préstamo (admin)
- `PUT /api/loans/:id/return` - Marcar como devuelto

## Formato de Respuesta

Todas las APIs deben retornar en el formato:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

O en caso de error:

```json
{
  "success": false,
  "error": "Mensaje de error",
  "message": "Descripción del error"
}
```

