# Bitácora de uso de IA (borrador)

Formato del Anexo C del enunciado. Se piden al menos 5 entradas y al menos 3 con un error o ajuste detectado.

| N.º | Parte | Qué le pedimos a la IA | Qué nos devolvió | Qué estaba mal / qué cambiamos y por qué |
|---|---|---|---|---|
| 1 | B | Generar el proyecto Maven con Spring Initializr (Web, Thymeleaf, JPA, MySQL). | Un `pom.xml` con Spring Boot `4.1.2.RELEASE`. | Maven no encontraba esa versión: en Maven Central se llama `4.1.2` (sin `.RELEASE`). La corregimos en el `pom.xml`. |
| 2 | B | Conectar Spring con la base de datos local. | Configuración con el driver de MySQL apuntando a MariaDB (lo que había instalado). | Hibernate fallaba al arrancar porque el driver de MySQL consulta una columna que MariaDB no tiene. Instalamos MySQL 8.4 (lo que pide la materia) en el puerto 3307. |
| 3 | B / C | Devolver actividades, socios e inscripciones como JSON. | Clases DTO con `record`, `stream()` y `Optional`. | Era más complejo de lo que vimos en la materia. Lo simplificamos: devolvemos las entidades y cortamos el ciclo Socio ↔ Inscripcion con `@JsonIgnore`; usamos `for` e `if`. |
| 4 | A | Armar el catálogo y el formulario del sitio público en HTML, CSS y JavaScript. | Páginas que usaban `<section>` para envolver los filtros, la lista y el formulario. | Una `<section>` debería tener un título, y esas no lo tenían: estaban "de decoración". Las cambiamos por `<div>` y dejamos `<section>` solo donde hay un encabezado. |
| 5 | B | Levantar el backend en el puerto 8080. | Configuración por defecto (`server.port=8080`). | En la compu de Juan el 8080 lo ocupa Apache. Cambiamos el backend al 8081. |
