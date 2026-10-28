# SocioClub — Club Social y Deportivo Los Algarrobos

Trabajo práctico integrador de Taller de Construcción de Software (Universidad Siglo 21).

## Integrantes

- Juan Patrito
- Valentín Meier
- _(completar)_

## Estructura del repositorio

| Carpeta | Qué es | Tecnologías |
|---|---|---|
| `sitio-publico/` | Parte A: sitio del club para los vecinos | HTML5, CSS3, JavaScript |
| `src/` (raíz) | Frontend del grupo: app de socios y panel interno | Next.js, React |
| `backend/` | Partes B y C: secretaría y API REST | Spring Boot, Thymeleaf, Spring Data JPA, MySQL |
| `base-datos/` | Script de creación y datos iniciales | MySQL |
| `docs/` | Plan de trabajo y bitácora de IA | |

## Cómo levantar el proyecto

1. **Base de datos** (MySQL 8):
   ```bash
   mysql -h 127.0.0.1 -P 3307 -u root < base-datos/socioclub.sql
   mysql -h 127.0.0.1 -P 3307 -u root < base-datos/crear-usuario.sql
   ```
2. **Backend**: `cd backend && ./mvnw spring-boot:run` y abrir http://localhost:8081/secretaria/actividades
3. **Sitio público**: abrir `sitio-publico/index.html` en el navegador.
4. **Frontend Next.js** conectado a Spring: crear `.env.local` en la raíz con
   ```
   MODO_API=spring
   SPRING_API_URL=http://localhost:8081
   NEXT_PUBLIC_USAR_API=true
   ```
   y ejecutar `pnpm install` y `pnpm dev` (http://localhost:3000).

Más detalle en [backend/README.md](backend/README.md).

## Datos de prueba

| DNI | Socio | Para probar |
|---|---|---|
| 40123456 | Lucía Pérez | Tiene 2 actividades (descuento 10 %) |
| 42123456 | Pedro Díaz | Tiene 3 actividades (RN5: máximo alcanzado) |
| 38123456 | María López | Cuota MOROSA (RN4) |
| 33123456 | Bruno Suárez | Cuota MOROSA (RN4) |
| 45123456 | Tomás Gómez | 11 años: no entra en Básquet juvenil, de 12 a 17 (RN3) |

Yoga arranca con 14 de 15 lugares ocupados (para probar RN1 y la baja de actividades con inscriptos).
