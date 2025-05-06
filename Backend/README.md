# Backend para el Dashboard de Gestión de Riesgos

Este es el backend en ASP.NET Core 7.0 para la aplicación de Gestión de Riesgos. Proporciona las APIs necesarias para el funcionamiento del frontend y maneja la autenticación con Active Directory.

## Características

- Autenticación con Active Directory
- Generación de tokens JWT para autenticar las solicitudes del frontend
- API RESTful para todas las operaciones de gestión de riesgos
- Documentación con Swagger

## Requisitos Previos

- .NET 7.0 SDK
- Acceso a un servidor Active Directory (opcional para desarrollo)

## Configuración

### Configurar appsettings.json

Antes de ejecutar la aplicación, debes configurar los siguientes valores en `appsettings.json`:

```json
{
  "ActiveDirectory": {
    "Domain": "YOURDOMAIN.LOCAL" // Reemplaza con tu dominio AD
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_HERE", // Reemplaza con una clave secreta fuerte
    "Issuer": "RiskManagementAPI",
    "Audience": "RiskManagementFrontend",
    "ExpireHours": 8
  }
}
```

### Ambiente de Desarrollo

En ambiente de desarrollo, la aplicación utiliza un servicio de Active Directory simulado (`MockActiveDirectoryService`), que acepta los siguientes usuarios:

- Username: "admin", Password: "password" (con rol de Administrators)
- Username: "user", Password: "password" (con rol de Users)

## Ejecución

```
cd RiskManagementAPI
dotnet run
```

La API estará disponible en: https://localhost:7018 (o el puerto configurado)

## Documentación API

La documentación de la API está disponible a través de Swagger en:

```
https://localhost:7018/swagger
```

## Estructura de Directorios

- `/Controllers`: Controladores de la API
- `/Models`: Modelos de datos
- `/Services`: Servicios para la lógica de negocio
- `/Properties`: Configuración de lanzamiento

## Integración con el Frontend

El frontend se conecta a este backend mediante las APIs REST. Las solicitudes autenticadas deben incluir un token JWT en el encabezado `Authorization`.

```
Authorization: Bearer <token>
```

## Seguridad

- Todas las contraseñas se validan contra Active Directory
- Las comunicaciones deben realizarse sobre HTTPS
- Los tokens JWT tienen una expiración configurable
- Las rutas protegidas requieren un token JWT válido

## Desarrollo

Para agregar nuevos endpoints:

1. Crear un controlador en `/Controllers`
2. Definir los modelos necesarios en `/Models`
3. Implementar la lógica de negocio en `/Services`
4. Documentar con atributos de Swagger

## Producción

En producción:

1. Configura un dominio de Active Directory válido
2. Cambia la clave secreta JWT por una clave fuerte
3. Configura HTTPS con un certificado válido
4. Considera utilizar almacenamiento de secretos de Azure/AWS 