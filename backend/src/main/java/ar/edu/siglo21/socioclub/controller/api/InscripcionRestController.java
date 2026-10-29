
package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.model.Inscripcion;
import ar.edu.siglo21.socioclub.service.InscripcionService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionRestController {

    private final InscripcionService inscripcionService;

    public InscripcionRestController(
            InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    // GET - Listar inscripciones
    @GetMapping
    public List<Inscripcion> listar() {
        return inscripcionService.listar();
    }

    // POST - Crear inscripción
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inscripcion inscribir(
            @RequestBody SolicitudInscripcion datos) {

        return inscripcionService.inscribir(
                datos.socioId(),
                datos.actividadId()
        );
    }

    // PUT - Dar de baja inscripción
    @PutMapping("/{id}/baja")
    public Inscripcion darDeBaja(@PathVariable Long id) {
        return inscripcionService.darDeBaja(id);
    }

    // Datos recibidos desde Next.js
    public record SolicitudInscripcion(
            Long socioId,
            Long actividadId
    ) {}
}
