package ar.edu.siglo21.socioclub.repository;

import ar.edu.siglo21.socioclub.model.Socio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocioRepository extends JpaRepository<Socio, Long> {

    // SELECT * FROM socio ORDER BY apellido
    List<Socio> findAllByOrderByApellidoAsc();

    // SELECT * FROM socio WHERE dni = ?   (para el ingreso a la app con DNI)
    Socio findByDni(String dni);

    // SELECT * FROM socio WHERE apellido LIKE '%texto%' ... LIMIT ...   (listado paginado de secretaría)
    Page<Socio> findByApellidoContainingIgnoreCase(String apellido, Pageable paginacion);
}
