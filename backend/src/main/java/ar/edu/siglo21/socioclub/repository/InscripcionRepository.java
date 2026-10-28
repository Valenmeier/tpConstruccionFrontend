package ar.edu.siglo21.socioclub.repository;

import ar.edu.siglo21.socioclub.model.EstadoInscripcion;
import ar.edu.siglo21.socioclub.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    // Consulta escrita a mano con @Query (en JPQL: se usan las clases y atributos, no las tablas).
    // Cuenta cuántas inscripciones de una actividad tienen cierto estado (por ejemplo, ACTIVA).
    @Query("SELECT COUNT(i) FROM Inscripcion i WHERE i.actividad.id = :actividadId AND i.estado = :estado")
    int contarPorActividadYEstado(@Param("actividadId") Long actividadId,
                                  @Param("estado") EstadoInscripcion estado);
}
