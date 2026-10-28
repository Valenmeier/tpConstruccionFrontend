-- Usuario con el que se conecta Spring Boot (solo para desarrollo local).
-- Ejecutar como root después de socioclub.sql.
CREATE USER IF NOT EXISTS 'socioclub'@'localhost' IDENTIFIED BY 'socioclub';
GRANT ALL PRIVILEGES ON socioclub.* TO 'socioclub'@'localhost';
