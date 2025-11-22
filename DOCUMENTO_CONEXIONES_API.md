# DOCUMENTO TÉCNICO: CONEXIONES API Y ARQUITECTURA DEL SISTEMA

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Microservicios Spring Boot](#microservicios-spring-boot)
3. [Frontend React](#frontend-react)
4. [Conexión Frontend ↔ Backend](#conexión-frontend--backend)
5. [SAM + SQLite](#sam--sqlite)
6. [Puertos y Configuración](#puertos-y-configuración)
7. [Formato de Respuestas API](#formato-de-respuestas-api)
8. [CORS y Seguridad](#cors-y-seguridad)
9. [Orden de Inicio del Sistema](#orden-de-inicio-del-sistema)
10. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Componentes del Sistema

El sistema LibraryUp está compuesto por:

```
┌─────────────────┐
│  Frontend React │  (Libre Hub / Library-Up)
│   Puerto 5173   │
└────────┬────────┘
         │ HTTP/REST
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼───┐ ┌───▼───┐ ┌───▼────┐
│ Libros│ │Users │ │Loans  │ │Reports │  Microservicios
│ :8081 │ │:8082 │ │:8083  │ │:8084   │  Spring Boot
└───┬───┘ └──┬───┘ └───┬───┘ └───┬────┘
    │        │         │         │
    └────────┴─────────┴─────────┘
                 │
            ┌────▼────┐
            │  SQLite │  Base de datos (SAM)
            │  (SAM)  │
            └─────────┘
```

### 1.2 Flujo de Datos

1. **Usuario interactúa** con la interfaz React
2. **React hace llamadas** a las APIs de los microservicios
3. **Microservicios procesan** la lógica de negocio
4. **SAM + SQLite** persiste los datos
5. **Respuesta** retorna al frontend
6. **React actualiza** la interfaz

---

## 2. MICROSERVICIOS SPRING BOOT

### 2.1 Microservicio de Libros (Books Service)

**Puerto**: `8081` (por defecto, configurable en `application.properties`)

**Base URL**: `http://localhost:8081/api/books`

**Endpoints**:

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| GET | `/api/books` | Listar todos los libros | Query: `?category=Programación` |
| GET | `/api/books/{id}` | Obtener un libro por ID | Path: `{id}` |
| POST | `/api/books` | Crear un nuevo libro | Body: `CreateBookDto` |
| PUT | `/api/books/{id}` | Actualizar un libro | Path: `{id}`, Body: `UpdateBookDto` |
| DELETE | `/api/books/{id}` | Eliminar un libro | Path: `{id}` |
| GET | `/api/books/search?q={query}` | Buscar libros | Query: `q` |

**Ejemplo de CreateBookDto**:
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Programación",
  "description": "Principios y buenas prácticas...",
  "coverUrl": "/img/books/clean-code.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "status": "disponible"
}
```

**Configuración en `application.properties`**:
```properties
server.port=8081
spring.datasource.url=jdbc:sqlite:books.db
spring.jpa.hibernate.ddl-auto=update
```

### 2.2 Microservicio de Usuarios (Users Service)

**Puerto**: `8082`

**Base URL**: `http://localhost:8082/api/users`

**Endpoints**:

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| POST | `/api/users/login` | Iniciar sesión | Body: `{email, password}` |
| POST | `/api/users/register` | Registrar usuario | Body: `RegisterDto` |
| GET | `/api/users` | Listar usuarios (Admin) | Headers: `Authorization` |
| GET | `/api/users/{id}` | Obtener usuario por ID | Path: `{id}` |
| POST | `/api/users` | Crear usuario (Admin) | Body: `CreateUserDto` |

**Ejemplo de LoginDto**:
```json
{
  "email": "user@libra.dev",
  "password": "123456"
}
```

**Respuesta de Login**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Usuario",
      "email": "user@libra.dev",
      "role": "User"
    },
    "token": "jwt-token-here"
  },
  "message": "Login exitoso"
}
```

**Configuración en `application.properties`**:
```properties
server.port=8082
spring.datasource.url=jdbc:sqlite:users.db
spring.jpa.hibernate.ddl-auto=update
```

### 2.3 Microservicio de Préstamos (Loans Service)

**Puerto**: `8083`

**Base URL**: `http://localhost:8083/api/loans`

**Endpoints**:

| Método | Ruta | Descripción | Parámetros |
|--------|------|-------------|------------|
| GET | `/api/loans` | Listar todos (Admin) | Headers: `Authorization` |
| GET | `/api/loans/{id}` | Obtener préstamo por ID | Path: `{id}` |
| GET | `/api/loans/user/{userId}` | Préstamos de un usuario | Path: `{userId}` |
| GET | `/api/loans/book/{bookId}` | Préstamos de un libro | Path: `{bookId}` |
| POST | `/api/loans` | Crear préstamo | Body: `{userId, bookId}` |
| POST | `/api/loans/many` | Crear múltiples préstamos | Body: `{userId, bookIds[]}` |
| PUT | `/api/loans/{id}/approve` | Aprobar préstamo (Admin) | Path: `{id}` |
| PUT | `/api/loans/{id}/reject` | Rechazar préstamo (Admin) | Path: `{id}` |
| PUT | `/api/loans/{id}/return` | Marcar como devuelto | Path: `{id}` |

**Ejemplo de CreateLoanDto**:
```json
{
  "userId": "user-uuid",
  "bookId": "book-uuid"
}
```

**Configuración en `application.properties`**:
```properties
server.port=8083
spring.datasource.url=jdbc:sqlite:loans.db
spring.jpa.hibernate.ddl-auto=update
```

### 2.4 Microservicio de Informes (Reports Service) - Opcional

**Puerto**: `8084`

**Base URL**: `http://localhost:8084/api/reports`

**Endpoints**:
- `GET /api/reports/loans-summary` - Resumen de préstamos
- `GET /api/reports/popular-books` - Libros más prestados
- `GET /api/reports/user-activity/{userId}` - Actividad de usuario

---

## 3. FRONTEND REACT

### 3.1 Estructura de la Capa API

El frontend tiene una capa de API centralizada en `src/api/`:

```
src/api/
├── httpClient.ts    # Cliente HTTP base con manejo de errores
├── booksApi.ts      # Cliente específico para Libros
├── usersApi.ts      # Cliente específico para Usuarios
└── loansApi.ts      # Cliente específico para Préstamos
```

### 3.2 Cliente HTTP Base (`httpClient.ts`)

**Características**:
- ✅ Configuración de URLs mediante variables de entorno
- ✅ Manejo automático de errores (ApiError personalizado)
- ✅ Headers automáticos (Content-Type: application/json)
- ✅ Token de autenticación automático (Bearer token)
- ✅ Manejo de respuestas vacías (204 No Content)
- ✅ Fallback a localStorage si la API falla

**Configuración de URLs**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BOOKS_API_URL = import.meta.env.VITE_BOOKS_API_URL || `${API_BASE_URL}/api/books`;
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || `${API_BASE_URL}/api/users`;
const LOANS_API_URL = import.meta.env.VITE_LOANS_API_URL || `${API_BASE_URL}/api/loans`;
```

### 3.3 Uso de las APIs en Componentes

**Ejemplo: Obtener todos los libros**
```typescript
import { booksApi } from '../api/booksApi';

const books = await booksApi.getAll();
// Retorna: Book[]
```

**Ejemplo: Crear un préstamo**
```typescript
import { loansApi } from '../api/loansApi';

const newLoan = await loansApi.create({
  userId: 'user-123',
  bookId: 'book-456'
});
// Retorna: LegacyLoan
```

**Ejemplo: Manejo de errores**
```typescript
import { booksApi } from '../api/booksApi';
import { ApiError } from '../api/httpClient';

try {
  const book = await booksApi.getById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      // Libro no encontrado
    } else if (error.status >= 500) {
      // Error del servidor
    } else if (error.status === 0) {
      // Error de conexión
    }
  }
}
```

---

## 4. CONEXIÓN FRONTEND ↔ BACKEND

### 4.1 Flujo de una Petición

```
1. Usuario hace clic en "Agregar al carrito"
   ↓
2. Componente React llama: booksApi.getById(id)
   ↓
3. httpClient.get() hace: fetch('http://localhost:8081/api/books/{id}')
   ↓
4. Spring Boot recibe la petición en el endpoint GET /api/books/{id}
   ↓
5. Microservicio consulta SQLite mediante SAM
   ↓
6. Retorna respuesta JSON: { success: true, data: {...} }
   ↓
7. httpClient parsea la respuesta
   ↓
8. Componente React actualiza el estado y renderiza
```

### 4.2 Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto React:

```env
# URL base de la API (si usas API Gateway)
VITE_API_BASE_URL=http://localhost:8080

# URLs específicas de cada microservicio
VITE_BOOKS_API_URL=http://localhost:8081/api/books
VITE_USERS_API_URL=http://localhost:8082/api/users
VITE_LOANS_API_URL=http://localhost:8083/api/loans
```

**Nota**: Las variables que empiezan con `VITE_` son expuestas al cliente en Vite.

### 4.3 Fallback a localStorage

El sistema está diseñado para funcionar **con o sin backend**:

1. **Intenta primero con la API** (si está configurada)
2. **Si falla**, automáticamente usa localStorage
3. **Muestra advertencia** cuando usa datos locales
4. **Permite desarrollo** sin necesidad de tener todos los microservicios corriendo

**Ejemplo de implementación**:
```typescript
try {
  const books = await booksApi.getAll();
  setBooks(books);
} catch (error) {
  // Fallback a localStorage
  const localBooks = bookService.getAll();
  setBooks(localBooks);
  // Muestra advertencia al usuario
}
```

---

## 5. SAM + SQLITE

### 5.1 ¿Qué es SAM?

SAM (Spring Application Manager) es una capa de abstracción que maneja la persistencia con SQLite en los microservicios Spring Boot.

### 5.2 Configuración de SQLite en Spring Boot

Cada microservicio tiene su propia base de datos SQLite:

**application.properties** (Microservicio de Libros):
```properties
# Puerto del microservicio
server.port=8081

# Configuración de SQLite
spring.datasource.url=jdbc:sqlite:books.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

**Dependencia Maven necesaria**:
```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.44.1.0</version>
</dependency>

<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
</dependency>
```

### 5.3 Archivos de Base de Datos

Cada microservicio crea su propio archivo `.db`:

- `books.db` - Base de datos del microservicio de Libros
- `users.db` - Base de datos del microservicio de Usuarios
- `loans.db` - Base de datos del microservicio de Préstamos

**Ubicación**: En el directorio raíz de cada microservicio (o según configuración)

### 5.4 Inicialización de Datos (Seeds)

**Opción 1: SQL Scripts**
```sql
-- seed.sql
INSERT INTO books (id, title, author, category, status) 
VALUES ('book-1', 'Clean Code', 'Robert C. Martin', 'Programación', 'disponible');
```

**Opción 2: DataLoader en Spring Boot**
```java
@Component
public class DataLoader implements CommandLineRunner {
    @Autowired
    private BookRepository bookRepository;
    
    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            // Cargar datos iniciales
        }
    }
}
```

### 5.5 Conflictos Comunes con SAM

**Problema**: SQLite bloquea la base de datos cuando hay múltiples conexiones.

**Solución**:
```properties
# Habilitar WAL mode para mejor concurrencia
spring.datasource.url=jdbc:sqlite:books.db?mode=wal
```

**Problema**: Base de datos no se crea automáticamente.

**Solución**: Verificar que `spring.jpa.hibernate.ddl-auto=update` esté configurado.

**Problema**: Errores de dialecto.

**Solución**: Asegurar que se use `SQLiteDialect` correcto para tu versión de Hibernate.

---

## 6. PUERTOS Y CONFIGURACIÓN

### 6.1 Puertos por Microservicio

| Microservicio | Puerto | URL Base | Estado |
|--------------|--------|----------|--------|
| Libros | 8081 | `http://localhost:8081` | Activo |
| Usuarios | 8082 | `http://localhost:8082` | Activo |
| Préstamos | 8083 | `http://localhost:8083` | Activo |
| Informes | 8084 | `http://localhost:8084` | Opcional |
| Frontend React | 5173 | `http://localhost:5173` | Activo |

### 6.2 Verificación de Puertos

**En Windows (PowerShell)**:
```powershell
# Ver puertos en uso
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083
```

**En Linux/Mac**:
```bash
lsof -i :8081
lsof -i :8082
lsof -i :8083
```

### 6.3 Configuración de Puertos en Spring Boot

**application.properties**:
```properties
# Puerto único para cada microservicio
server.port=8081  # Para microservicio de Libros
server.port=8082  # Para microservicio de Usuarios
server.port=8083  # Para microservicio de Préstamos
```

**Verificar que cada microservicio use un puerto diferente**.

---

## 7. FORMATO DE RESPUESTAS API

### 7.1 Formato Estándar

Todas las APIs deben retornar en el formato:

**Éxito**:
```json
{
  "success": true,
  "data": {
    // Datos de la respuesta
  },
  "message": "Operación exitosa"
}
```

**Error**:
```json
{
  "success": false,
  "error": "Mensaje de error específico",
  "message": "Descripción detallada del error",
  "status": 404
}
```

### 7.2 Ejemplos de Respuestas

**GET /api/books - Listar libros**:
```json
{
  "success": true,
  "data": [
    {
      "id": "book-1",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Programación",
      "description": "...",
      "coverUrl": "/img/books/clean-code.jpg",
      "status": "disponible"
    }
  ],
  "message": "Libros obtenidos correctamente"
}
```

**GET /api/books/{id} - Libro no encontrado (404)**:
```json
{
  "success": false,
  "error": "Libro no encontrado",
  "message": "No existe un libro con el ID proporcionado",
  "status": 404
}
```

**POST /api/users/login - Login exitoso**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "Juan Pérez",
      "email": "juan@libra.dev",
      "role": "User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

**POST /api/users/login - Credenciales incorrectas (401)**:
```json
{
  "success": false,
  "error": "Credenciales inválidas",
  "message": "El email o la contraseña son incorrectos",
  "status": 401
}
```

### 7.3 Manejo en el Frontend

El `httpClient.ts` maneja automáticamente estos formatos:

```typescript
// Si la respuesta tiene success: true
const response = await httpClient.get<ApiResponse<Book[]>>('/api/books');
return response.data || []; // Retorna el array de libros

// Si la respuesta tiene success: false
// Se lanza un ApiError con el mensaje del error
```

---

## 8. CORS Y SEGURIDAD

### 8.1 Configuración de CORS en Spring Boot

**Opción 1: Configuración Global (Recomendada)**

Crear `CorsConfig.java`:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000",  // Alternativa
                "http://localhost:5174"   // Si cambias el puerto
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

**Opción 2: Anotación @CrossOrigin en cada Controller**

```java
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookController {
    // ...
}
```

### 8.2 Headers de Autenticación

El frontend envía automáticamente el token de autenticación:

```typescript
// En httpClient.ts
const session = localStorage.getItem('session');
if (session) {
  const sessionData = JSON.parse(session);
  if (sessionData.token) {
    defaultHeaders['Authorization'] = `Bearer ${sessionData.token}`;
  }
}
```

**Validación en Spring Boot**:
```java
@GetMapping("/api/books")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getAllBooks(
    @RequestHeader("Authorization") String authHeader
) {
    // Validar token JWT
    // ...
}
```

---

## 9. ORDEN DE INICIO DEL SISTEMA

### 9.1 Secuencia Recomendada

```
1. Iniciar SAM (si es necesario)
   ↓
2. Iniciar Microservicio de Usuarios (puerto 8082)
   ↓
3. Iniciar Microservicio de Libros (puerto 8081)
   ↓
4. Iniciar Microservicio de Préstamos (puerto 8083)
   ↓
5. Verificar que todos los microservicios estén corriendo
   ↓
6. Iniciar Frontend React (puerto 5173)
```

### 9.2 Comandos de Inicio

**Backend (cada microservicio)**:
```bash
# Navegar al directorio del microservicio
cd biblioteca-main/books-service
# O donde esté ubicado cada microservicio

# Ejecutar con Maven
mvn spring-boot:run

# O compilar y ejecutar
mvn clean package
java -jar target/books-service-1.0.0.jar
```

**Verificar que los microservicios están corriendo**:
```bash
# Verificar puerto 8081 (Libros)
curl http://localhost:8081/api/books

# Verificar puerto 8082 (Usuarios)
curl http://localhost:8082/api/users

# Verificar puerto 8083 (Préstamos)
curl http://localhost:8083/api/loans
```

**Frontend**:
```bash
cd library-up
npm install  # Solo la primera vez
npm run dev  # Inicia en http://localhost:5173
```

### 9.3 Verificación de Estado

**Endpoint de Health Check** (si está implementado):
```
GET http://localhost:8081/actuator/health
GET http://localhost:8082/actuator/health
GET http://localhost:8083/actuator/health
```

Respuesta esperada:
```json
{
  "status": "UP"
}
```

---

## 10. ERRORES COMUNES Y SOLUCIONES

### 10.1 Error: "API Error" / "Error Status"

**Síntoma**: Pantalla en blanco, mensaje "API Error" o "Error Status".

**Causas posibles**:

1. **Microservicio no está corriendo**
   - **Solución**: Verificar que el microservicio esté iniciado y escuchando en el puerto correcto
   - **Verificación**: `curl http://localhost:8081/api/books`

2. **Puerto incorrecto en `.env`**
   - **Solución**: Verificar que las URLs en `.env` coincidan con los puertos de los microservicios
   - **Ejemplo**: Si el microservicio de Libros está en 8081, `VITE_BOOKS_API_URL=http://localhost:8081/api/books`

3. **CORS no configurado**
   - **Síntoma**: Error en consola del navegador: "CORS policy blocked"
   - **Solución**: Configurar CORS en Spring Boot (ver sección 8.1)

4. **Formato de respuesta incorrecto**
   - **Síntoma**: Error al parsear JSON
   - **Solución**: Verificar que el backend retorne el formato estándar `{ success, data, message }`

5. **Error de red (status 0)**
   - **Causa**: El microservicio no está accesible o hay firewall bloqueando
   - **Solución**: Verificar conectividad y firewalls

### 10.2 Error: "CORS policy blocked"

**Síntoma**: 
```
Access to fetch at 'http://localhost:8081/api/books' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solución**:

1. Agregar configuración CORS en Spring Boot:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("*")
            .allowedHeaders("*");
    }
}
```

2. Reiniciar el microservicio

3. Verificar que la URL del frontend coincida con `allowedOrigins`

### 10.3 Error: "Pantalla en blanco" sin mensaje

**Síntoma**: La aplicación carga pero no muestra nada.

**Causas**:

1. **Error en componente que no está manejado**
   - **Solución**: El `ErrorBoundary` debería capturarlo, pero si no, revisar la consola del navegador

2. **Usuario no autenticado y ruta protegida**
   - **Solución**: Verificar que el usuario esté logueado o que la ruta no requiera autenticación

3. **Error de JavaScript no capturado**
   - **Solución**: Abrir DevTools (F12) → Console para ver errores

**Verificación**:
```javascript
// En consola del navegador
console.log(localStorage.getItem('session'));
console.log(window.location.href);
```

### 10.4 Error: "Cannot read property 'xxx' of null"

**Síntoma**: Error de JavaScript al acceder a propiedades de null/undefined.

**Causa**: El componente intenta acceder a datos antes de que se carguen.

**Solución**: Agregar validaciones:
```typescript
if (!book) {
  return <ResourceError error={new Error('Libro no encontrado')} />;
}
```

### 10.5 Error: "Network Error" (status 0)

**Síntoma**: Error de conexión cuando intenta llamar a la API.

**Causas**:

1. **Microservicio no está corriendo**
   - **Solución**: Iniciar el microservicio

2. **Puerto incorrecto**
   - **Solución**: Verificar `.env` y los puertos de los microservicios

3. **Firewall bloqueando conexión**
   - **Solución**: Deshabilitar firewall temporalmente para pruebas o configurar excepciones

4. **URL incorrecta**
   - **Solución**: Verificar que la URL en `httpClient.ts` sea correcta

### 10.6 Error: "404 Not Found"

**Síntoma**: El microservicio responde pero retorna 404.

**Causas**:

1. **Ruta incorrecta en el endpoint**
   - **Solución**: Verificar que la ruta en el frontend coincida con la del backend
   - **Ejemplo**: Frontend: `/api/books/{id}` vs Backend: `/api/books/{id}`

2. **Recurso no existe**
   - **Solución**: Verificar que el ID del recurso sea válido

### 10.7 Error: "500 Internal Server Error"

**Síntoma**: Error del servidor al procesar la petición.

**Causas**:

1. **Error en la lógica del backend**
   - **Solución**: Revisar logs del microservicio

2. **Base de datos no accesible**
   - **Solución**: Verificar que SQLite esté configurado correctamente

3. **Validación fallida**
   - **Solución**: Verificar que los datos enviados sean válidos

### 10.8 Error: SAM/SQLite bloqueando inicio

**Síntoma**: El microservicio no inicia o falla al conectarse a SQLite.

**Soluciones**:

1. **Habilitar WAL mode**:
```properties
spring.datasource.url=jdbc:sqlite:books.db?mode=wal
```

2. **Verificar permisos del archivo .db**:
```bash
# En Linux/Mac
chmod 644 books.db

# En Windows: Verificar que no esté bloqueado por antivirus
```

3. **Cerrar conexiones existentes**:
   - Cerrar otras aplicaciones que puedan estar usando la base de datos
   - Reiniciar el microservicio

### 10.9 Solución Rápida: Modo Fallback

Si el backend no está disponible, el frontend automáticamente usa localStorage:

1. **Los datos se cargan del localStorage**
2. **Se muestra una advertencia** indicando que está usando datos locales
3. **La aplicación funciona normalmente** pero solo con datos locales
4. **Cuando el backend esté disponible**, automáticamente intentará usarlo

---

## 11. DEBUGGING Y TROUBLESHOOTING

### 11.1 Verificar Conexiones

**En el navegador (DevTools)**:
1. Abrir DevTools (F12)
2. Ir a pestaña **Network**
3. Intentar una acción en la aplicación
4. Ver las peticiones HTTP:
   - **Status**: 200 (OK), 404 (No encontrado), 500 (Error servidor)
   - **URL**: Verificar que apunte al puerto correcto
   - **Response**: Ver el contenido de la respuesta

### 11.2 Logs del Backend

**Ver logs en consola**:
```bash
# Los logs de Spring Boot muestran:
# - Peticiones recibidas
# - Errores de base de datos
# - Errores de validación
```

**Ejemplo de log**:
```
2024-01-15 10:30:45.123  INFO --- [nio-8081-exec-1] c.l.b.controller.BookController : GET /api/books
2024-01-15 10:30:45.456  INFO --- [nio-8081-exec-1] c.l.b.service.BookService : Found 25 books
```

### 11.3 Verificar Variables de Entorno

**En el frontend**:
```typescript
// En la consola del navegador
console.log(import.meta.env.VITE_BOOKS_API_URL);
// Debe mostrar: http://localhost:8081/api/books
```

**Si es `undefined`**:
- Verificar que el archivo `.env` existe
- Reiniciar el servidor de desarrollo (`npm run dev`)

### 11.4 Test Manual de Endpoints

**Usando curl**:
```bash
# Test GET /api/books
curl http://localhost:8081/api/books

# Test POST /api/users/login
curl -X POST http://localhost:8082/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@libra.dev","password":"123456"}'
```

**Usando Postman o Insomnia**:
- Crear petición GET a `http://localhost:8081/api/books`
- Verificar respuesta y headers

---

## 12. MEJORES PRÁCTICAS

### 12.1 Backend (Spring Boot)

1. **Siempre retornar formato estándar**:
   ```java
   return ResponseEntity.ok(new ApiResponse<>(true, data, "Success"));
   ```

2. **Manejar excepciones globalmente**:
   ```java
   @ControllerAdvice
   public class GlobalExceptionHandler {
       @ExceptionHandler(ResourceNotFoundException.class)
       public ResponseEntity<ApiResponse<?>> handleNotFound(...) {
           return ResponseEntity.status(404)
               .body(new ApiResponse<>(false, null, "Recurso no encontrado"));
       }
   }
   ```

3. **Validar datos de entrada**:
   ```java
   @PostMapping("/api/books")
   public ResponseEntity<?> createBook(@Valid @RequestBody CreateBookDto dto) {
       // Validación automática con @Valid
   }
   ```

### 12.2 Frontend (React)

1. **Siempre manejar errores**:
   ```typescript
   try {
     const data = await api.getData();
   } catch (error) {
     // Mostrar error al usuario, no dejar pantalla en blanco
     setError(error);
   }
   ```

2. **Usar estados de loading**:
   ```typescript
   const [loading, setLoading] = useState(true);
   // ...
   if (loading) return <Spinner />;
   ```

3. **Validar datos antes de renderizar**:
   ```typescript
   if (!book) {
     return <ResourceError error={new Error('No encontrado')} />;
   }
   ```

---

## 13. CHECKLIST DE CONFIGURACIÓN

### ✅ Backend

- [ ] Cada microservicio tiene su `server.port` único
- [ ] CORS configurado para permitir `http://localhost:5173`
- [ ] SQLite configurado correctamente
- [ ] Endpoints retornan formato estándar `{ success, data, message }`
- [ ] Manejo de excepciones implementado
- [ ] Logs habilitados para debugging

### ✅ Frontend

- [ ] Archivo `.env` creado con URLs correctas
- [ ] `ErrorBoundary` implementado en `main.tsx`
- [ ] Componentes de error creados (`ErrorPage`, `NotFoundPage`, `ResourceError`)
- [ ] Manejo de errores en todos los componentes principales
- [ ] Fallback a localStorage funciona
- [ ] Loading states implementados

### ✅ Conexión

- [ ] Todos los microservicios están corriendo
- [ ] Puertos verificados (8081, 8082, 8083)
- [ ] Frontend puede acceder a los microservicios
- [ ] CORS no está bloqueando las peticiones
- [ ] Tokens de autenticación se envían correctamente

---

## 14. RESUMEN

### Arquitectura
- **Frontend**: React en puerto 5173
- **Backend**: Microservicios Spring Boot en puertos 8081, 8082, 8083
- **Base de datos**: SQLite mediante SAM
- **Comunicación**: HTTP/REST (JSON)

### Conexión
- **Frontend → Backend**: Mediante `httpClient.ts` y APIs específicas
- **Backend → SQLite**: Mediante SAM y JPA/Hibernate
- **Autenticación**: Bearer tokens en headers

### Manejo de Errores
- **Frontend**: ErrorBoundary + componentes de error + fallback a localStorage
- **Backend**: Formato estándar de respuesta + códigos HTTP correctos
- **Usuario**: Mensajes claros + URL actual visible + botones de acción

### Orden de Inicio
1. SAM (si necesario)
2. Microservicios (8082 → 8081 → 8083)
3. Frontend (5173)

---

**Última actualización**: 2024-01-15
**Versión del documento**: 1.0

