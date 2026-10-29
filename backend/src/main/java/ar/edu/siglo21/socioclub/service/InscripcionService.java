
package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.model.Inscripcion;
import ar.edu.siglo21.socioclub.model.EstadoCuota;
import ar.edu.siglo21.socioclub.model.EstadoInscripcion;

import ar.edu.siglo21.socioclub.repository.ActividadRepository;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final SocioRepository socioRepository;
    private final ActividadRepository actividadRepository;

    public InscripcionService(
            InscripcionRepository inscripcionRepository,
            SocioRepository socioRepository,
            ActividadRepository actividadRepository) {

        this.inscripcionRepository = inscripcionRepository;
        this.socioRepository = socioRepository;
        this.actividadRepository = actividadRepository;
    }

    // LISTAR INSCRIPCIONES
    public List<Inscripcion> listar() {
        return inscripcionRepository.findAll();
    }


    @Transactional
    public Inscripcion darDeBaja(Long id) {

        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Inscripción no encontrada."
                        )
                );

        inscripcion.setEstado(EstadoInscripcion.BAJA);

        return inscripcionRepository.save(inscripcion);
    }

    // INSCRIBIR SOCIO A UNA ACTIVIDAD
    @Transactional
    public Inscripcion inscribir(Long socioId, Long actividadId) {

        if (socioId == null || actividadId == null
                || socioId <= 0 || actividadId <= 0) {
            throw new DatosInvalidosException(
                    "Seleccioná un socio y una actividad válidos."
            );
        }

        // Buscar socio
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Socio no encontrado."
                        )
                );

        // Buscar actividad activa
        Actividad actividad = actividadRepository
                .findByIdAndActivaTrue(actividadId);

        if (actividad == null) {
            throw new RecursoNoEncontradoException(
                    "Actividad no encontrada."
            );
        }

        // RN1: Verificar cupos disponibles
        int ocupados = inscripcionRepository
                .contarPorActividadYEstado(
                        actividadId,
                        EstadoInscripcion.ACTIVA
                );

        if (ocupados >= actividad.getCupoMaximo()) {
            throw new ReglaNegocioException(
                    "La actividad no tiene cupo disponible.",
                    "RN1"
            );
        }

        // RN2: Evitar inscripción duplicada
        boolean duplicada = inscripcionRepository
                .existsBySocio_IdAndActividad_IdAndEstado(
                        socioId,
                        actividadId,
                        EstadoInscripcion.ACTIVA
                );

        if (duplicada) {
            throw new ReglaNegocioException(
                    "El socio ya está inscripto en esta actividad.",
                    "RN2"
            );
        }

        // RN3: Verificar edad
        int edad = Period.between(
                socio.getFechaNacimiento(),
                LocalDate.now()
        ).getYears();

        if (edad < actividad.getEdadMinima()
                || edad > actividad.getEdadMaxima()) {

            throw new ReglaNegocioException(
                    "No cumplís con el rango de edad permitido.",
                    "RN3"
            );
        }

        // RN4: Verificar cuota
        if (socio.getEstadoCuota() == EstadoCuota.MOROSO) {
            throw new ReglaNegocioException(
                    "Debés regularizar tu cuota.",
                    "RN4"
            );
        }

        // RN5: Máximo tres actividades
        long cantidad = inscripcionRepository
                .countBySocio_IdAndEstado(
                        socioId,
                        EstadoInscripcion.ACTIVA
                );

        if (cantidad >= 3) {
            throw new ReglaNegocioException(
                    "Alcanzaste el máximo de 3 actividades.",
                    "RN5"
            );
        }

        // Guardar inscripción
        Inscripcion inscripcion = new Inscripcion();

        inscripcion.setSocio(socio);
        inscripcion.setActividad(actividad);
        inscripcion.setFechaInscripcion(LocalDate.now());
        inscripcion.setEstado(EstadoInscripcion.ACTIVA);

        return inscripcionRepository.save(inscripcion);
    }
}
