package ar.edu.siglo21.socioclub.repository;

import ar.edu.siglo21.socioclub.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// JpaRepository ya trae save, findById, findAll, delete, etc.
// Acá solo agregamos métodos derivados del nombre: Spring arma el SQL leyendo el nombre.
public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    // SELECT * FROM actividad WHERE activa = true
    List<Actividad> findByActivaTrue();

    // SELECT * FROM actividad WHERE disciplina = ? AND activa = true
    List<Actividad> findByDisciplinaAndActivaTrue(String disciplina);

    // SELECT * FROM actividad WHERE id = ? AND activa = true   (devuelve null si no existe)
    Actividad findByIdAndActivaTrue(Long id);
}
