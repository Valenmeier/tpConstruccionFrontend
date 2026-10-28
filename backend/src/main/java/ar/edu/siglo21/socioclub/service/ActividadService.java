package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.model.EstadoInscripcion;
import ar.edu.siglo21.socioclub.repository.ActividadRepository;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

// Capa de servicio: acá están las reglas de negocio de las actividades.
// La usan el controlador de Thymeleaf y el controlador REST, así las reglas se escriben una sola vez.
@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final InscripcionRepository inscripcionRepository;

    // Spring crea los repositorios y los pasa por este constructor (inyección de dependencias).
    public ActividadService(ActividadRepository actividadRepository,
                            InscripcionRepository inscripcionRepository) {
        this.actividadRepository = actividadRepository;
        this.inscripcionRepository = inscripcionRepository;
    }

    // Lista las actividades activas. Si viene una disciplina, filtra por ella.
    public List<Actividad> listar(String disciplina) {
        List<Actividad> actividades;
        if (disciplina == null || disciplina.isBlank()) {
            actividades = actividadRepository.findByActivaTrue();
        } else {
            actividades = actividadRepository.findByDisciplinaAndActivaTrue(disciplina);
        }

        for (Actividad actividad : actividades) {
            calcularCupoDisponible(actividad);
        }
        return actividades;
    }

    public Actividad buscarPorId(Long id) {
        Actividad actividad = actividadRepository.findByIdAndActivaTrue(id);
        if (actividad == null) {
            throw new RecursoNoEncontradoException("Actividad no encontrada.");
        }
        calcularCupoDisponible(actividad);
        return actividad;
    }

    @Transactional
    public Actividad crear(Actividad actividad) {
        validar(actividad);
        actividad.setId(null);      // el id lo genera la base de datos
        actividad.setActiva(true);
        Actividad guardada = actividadRepository.save(actividad);
        calcularCupoDisponible(guardada);
        return guardada;
    }

    @Transactional
    public Actividad actualizar(Long id, Actividad datos) {
        Actividad actividad = buscarPorId(id);
        validar(datos);

        // Regla: no se puede bajar el cupo por debajo de la cantidad de inscriptos activos.
        int inscriptosActivos = contarInscriptosActivos(id);
        if (datos.getCupoMaximo() < inscriptosActivos) {
            throw new ReglaNegocioException(
                    "El cupo máximo no puede ser menor a la cantidad de inscriptos activos.");
        }

        actividad.setNombre(datos.getNombre());
        actividad.setDisciplina(datos.getDisciplina());
        actividad.setProfesor(datos.getProfesor());
        actividad.setDias(datos.getDias());
        actividad.setHorario(datos.getHorario());
        actividad.setEdadMinima(datos.getEdadMinima());
        actividad.setEdadMaxima(datos.getEdadMaxima());
        actividad.setCupoMaximo(datos.getCupoMaximo());
        actividad.setCuotaMensual(datos.getCuotaMensual());
        actividad.setDescripcion(datos.getDescripcion());

        Actividad guardada = actividadRepository.save(actividad);
        calcularCupoDisponible(guardada);
        return guardada;
    }

    @Transactional
    public void eliminar(Long id) {
        Actividad actividad = buscarPorId(id);

        // Regla: no se puede eliminar una actividad que tiene inscriptos activos.
        if (contarInscriptosActivos(id) > 0) {
            throw new ReglaNegocioException("No se puede eliminar una actividad con inscriptos activos.");
        }

        // Baja lógica: no borramos la fila, la marcamos como inactiva para no perder el historial.
        actividad.setActiva(false);
        actividadRepository.save(actividad);
    }

    private int contarInscriptosActivos(Long actividadId) {
        return inscripcionRepository.contarPorActividadYEstado(actividadId, EstadoInscripcion.ACTIVA);
    }

    private void calcularCupoDisponible(Actividad actividad) {
        int inscriptosActivos = contarInscriptosActivos(actividad.getId());
        actividad.setCupoDisponible(actividad.getCupoMaximo() - inscriptosActivos);
    }

    private void validar(Actividad actividad) {
        if (estaVacio(actividad.getNombre()) || estaVacio(actividad.getDisciplina())
                || estaVacio(actividad.getProfesor()) || estaVacio(actividad.getDias())
                || estaVacio(actividad.getHorario())) {
            throw new DatosInvalidosException("Completá nombre, disciplina, profesor, días y horario.");
        }
        if (actividad.getEdadMinima() == null || actividad.getEdadMaxima() == null
                || actividad.getCupoMaximo() == null || actividad.getCuotaMensual() == null) {
            throw new DatosInvalidosException("Completá edades, cupo y cuota.");
        }
        if (actividad.getEdadMinima() < 0 || actividad.getEdadMaxima() < actividad.getEdadMinima()) {
            throw new DatosInvalidosException("La edad máxima debe ser mayor o igual a la edad mínima.");
        }
        if (actividad.getCupoMaximo() < 1) {
            throw new DatosInvalidosException("El cupo máximo debe ser al menos 1.");
        }
        if (actividad.getCuotaMensual().compareTo(BigDecimal.ZERO) < 0) {
            throw new DatosInvalidosException("La cuota no puede ser negativa.");
        }
    }

    private boolean estaVacio(String texto) {
        return texto == null || texto.isBlank();
    }
}
