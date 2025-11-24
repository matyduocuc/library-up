# Conexión Simple: Frontend React con Microservicios Java

## 🎯 Configuración Simple

Este documento explica cómo conectar el frontend React con los 4 microservicios principales de Java de forma simple.

## 📋 Los 4 Microservicios

1. **Libros** - Puerto 8082 - `/api/libros`
2. **Usuarios** - Puerto 8081 - `/api/usuarios` y `/api/auth`
3. **Préstamos** - Puerto 8083 - `/api/v1/prestamos`
4. **Informes** - Puerto 8085 - `/api/informes`

## 🚀 Pasos para Conectar

### 1. Crear archivo `.env`

En la raíz del proyecto frontend (`library-up`), crea un archivo `.env` con:

```env
VITE_BOOKS_API_URL=http://localhost:8082/api/libros
VITE_USERS_API_URL=http://localhost:8081/api/usuarios
VITE_AUTH_API_URL=http://localhost:8081/api/auth
VITE_LOANS_API_URL=http://localhost:8083/api/v1/prestamos
VITE_REPORTS_API_URL=http://localhost:8085/api/informes
```

### 2. Iniciar los Microservicios

Abre 4 terminales y ejecuta:

```bash
# Terminal 1: Libros
cd "C:\Users\SSDD\Downloads\-Backend\Biblioteca-java-main\LibrosCatalogo"
mvn spring-boot:run

# Terminal 2: Usuarios
cd "C:\Users\SSDD\Downloads\-Backend\Biblioteca-java-main\Gestión de Usuarios"
mvn spring-boot:run

# Terminal 3: Préstamos
cd "C:\Users\SSDD\Downloads\-Backend\Biblioteca-java-main\Gestión de prestamos"
mvn spring-boot:run

# Terminal 4: Informes
cd "C:\Users\SSDD\Downloads\-Backend\Biblioteca-java-main\GestionDeInformes\GestionDeInformes"
mvn spring-boot:run
```

### 3. Iniciar el Frontend

```bash
cd "C:\Users\SSDD\Downloads\library-up"
npm install  # Solo la primera vez
npm run dev
```

## ✅ Verificar que Funciona

Una vez iniciados todos los servicios, deberías poder:

1. Ver el catálogo de libros en `/catalog`
2. Iniciar sesión en `/login`
3. Ver tus préstamos en `/my-loans`
4. Crear nuevos préstamos

## 📝 Formato de Respuesta del Backend

El backend Java devuelve respuestas en este formato:

```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Operación exitosa",
  "data": { ... }
}
```

El `httpClient` extrae automáticamente el campo `data`, así que no necesitas preocuparte por eso.

## 🔧 Si Algo No Funciona

1. **Verifica que los puertos estén libres**: Cada microservicio debe estar en su puerto
2. **Revisa la consola del navegador**: Verás errores de conexión si algo falla
3. **Revisa las URLs**: Asegúrate de que las URLs en `.env` coincidan con los puertos de los microservicios
4. **Reinicia el frontend**: Después de crear o modificar `.env`, reinicia el servidor de desarrollo

## 💡 Notas Importantes

- El frontend tiene fallback a localStorage, así que si los microservicios no están corriendo, seguirá funcionando con datos locales
- El login requiere que el microservicio de Usuarios esté corriendo
- Los préstamos requieren que ambos microservicios (Usuarios y Préstamos) estén corriendo

