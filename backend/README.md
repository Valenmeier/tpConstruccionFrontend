# SocioClub — Backend (Spring Boot)

Sistema de secretaría con Thymeleaf y API REST bajo `/api`. Los dos usan la misma capa de servicio.

## Requisitos

- JDK 17 o superior
- MySQL 8
- Maven no hace falta instalarlo: se usa `./mvnw`

## 1. Crear la base

Desde la raíz del repositorio (cambiar el puerto si tu MySQL usa otro):

```bash
mysql -h 127.0.0.1 -P 3307 -u root < base-datos/socioclub.sql
mysql -h 127.0.0.1 -P 3307 -u root < base-datos/crear-usuario.sql
```

## 2. Levantar el backend

```bash
cd backend
./mvnw spring-boot:run
```

- Secretaría (Thymeleaf): http://localhost:8081/secretaria/actividades
- API: http://localhost:8081/api/actividades

La conexión está en `src/main/resources/application.properties` (MySQL en el puerto 3307, backend en el 8081).

## Estructura

```
src/main/java/ar/edu/siglo21/socioclub/
├── model/        Entidades JPA: Socio, Actividad, Inscripcion (+ enums de estado)
├── repository/   Interfaces JpaRepository (métodos derivados y @Query)
├── service/      Reglas de negocio y excepciones
├── controller/
│   ├── web/      @Controller con vistas Thymeleaf (secretaría)
│   └── api/      @RestController bajo /api + manejo de errores HTTP
└── config/       CORS para la app React (localhost:3000)
```

## Endpoints implementados

| Verbo  | Ruta                                                               | Respuestas            |
| ------ | ------------------------------------------------------------------ | --------------------- |
| GET    | `/api/actividades` (acepta `?disciplina=`)                         | 200                   |
| GET    | `/api/actividades/{id}`                                            | 200 / 404             |
| POST   | `/api/actividades`                                                 | 201 / 400             |
| PUT    | `/api/actividades/{id}`                                            | 200 / 400 / 404 / 409 |
| DELETE | `/api/actividades/{id}` (baja lógica, solo sin inscriptos activos) | 204 / 404 / 409       |
| GET    | `/api/socios`                                                      | 200                   |
| GET    | `/api/inscripciones`                                               | 200                   |

Los errores vuelven como `{"error": "mensaje"}` (y `"regla": "RN1"` cuando corresponde).
