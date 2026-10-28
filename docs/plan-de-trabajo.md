# Plan de trabajo — TP SocioClub

Estado al cierre de la Semana 1 y tareas pendientes por hito (sección 6 del enunciado).
Completar la columna **Responsable** con el nombre de cada integrante.

## Hecho (Semana 1)

| Parte | Qué está funcionando | Dónde |
|---|---|---|
| A | Sitio público: inicio, catálogo con filtros por disciplina y edad, preinscripción validada, diseño responsivo | `sitio-publico/` |
| B | Proyecto Maven con Spring Boot en capas (model, repository, service, controller) | `backend/` |
| B | Entidades JPA `Socio`, `Actividad`, `Inscripcion` con `@ManyToOne` / `@OneToMany` | `backend/.../model` |
| B | Repositorios con métodos derivados y una consulta `@Query` | `backend/.../repository` |
| B | Base MySQL con las 8 actividades y 20 socios de prueba (2 morosos, Yoga con 14/15) | `base-datos/` |
| B | ABM de actividades en Thymeleaf con cupo disponible y fragmentos (encabezado y pie) | `backend/.../templates` |
| C (adelanto) | Endpoints REST de actividades, listado de socios e inscripciones, CORS | `backend/.../controller/api` |
| D | Frontend del grupo en Next.js: catálogo, detalle, ingreso, mis actividades, cuota, panel interno, con datos locales o con API | `src/` (raíz) |

## Semana 2

| Tarea | Parte | Responsable | Estado |
|---|---|---|---|
| Listado de socios paginado (`Pageable`) con búsqueda por apellido en Thymeleaf | B | | Pendiente |
| Alta y edición de socios en Thymeleaf | B | | Pendiente |
| `InscripcionService` con las reglas RN1 a RN5 y sus mensajes | B | | Pendiente |
| Formulario de inscripción (elegir socio y actividad) y listado de inscriptos por actividad | B | | Pendiente |

## Semana 3

| Tarea | Parte | Responsable | Estado |
|---|---|---|---|
| Completar endpoints: `GET /api/socios/dni/{dni}`, `POST/PUT /api/socios`, `GET /api/socios/{id}/inscripciones`, `POST /api/inscripciones`, `PUT /api/inscripciones/{id}/baja` | C | | Pendiente |
| Colección de Postman con casos exitosos y de error (RN1 a RN5) | C | | Pendiente |
| Conectar el frontend Next.js a Spring (`MODO_API=spring`, `SPRING_API_URL=http://localhost:8081`) y probar ingreso, inscripción y baja reales | D | | Pendiente |
| Pruebas Jest de `calcularCuotaMensual` (RN6) y `esDniValido` (RN7), mínimo 6, sobre `src/utilidades/formatos.js` | E | | Pendiente |

## Entrega final

| Tarea | Parte | Responsable | Estado |
|---|---|---|---|
| 2 pruebas de componente con React Testing Library sobre `TarjetaActividad` | E | | Pendiente |
| Prueba de sistema: tabla con 6 casos de punta a punta | E | | Pendiente |
| README completo, informe PDF (8 a 12 páginas) y bitácora de IA | F | | Pendiente |
| Incorporar las devoluciones de la exposición | Todas | | Pendiente |
