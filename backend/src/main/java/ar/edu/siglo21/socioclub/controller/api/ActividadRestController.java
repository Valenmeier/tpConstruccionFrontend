package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.service.ActividadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// @RestController: cada método devuelve datos en JSON (no una página HTML).
// Usa el MISMO servicio que el controlador de Thymeleaf.
@RestController
@RequestMapping("/api/actividades")
public class ActividadRestController {

    private final ActividadService actividadService;

    public ActividadRestController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    // GET /api/actividades   o   GET /api/actividades?disciplina=Fútbol
    @GetMapping
    public List<Actividad> listar(@RequestParam(required = false) String disciplina) {
        return actividadService.listar(disciplina);
    }

    // GET /api/actividades/1   -> 200, o 404 si no existe
    @GetMapping("/{id}")
    public Actividad buscar(@PathVariable Long id) {
        return actividadService.buscarPorId(id);
    }

    // POST /api/actividades   -> 201 Created
    @PostMapping
    public ResponseEntity<Actividad> crear(@RequestBody Actividad actividad) {
        Actividad creada = actividadService.crear(actividad);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // PUT /api/actividades/1   -> 200
    @PutMapping("/{id}")
    public Actividad actualizar(@PathVariable Long id, @RequestBody Actividad actividad) {
        return actividadService.actualizar(id, actividad);
    }

    // DELETE /api/actividades/1   -> 204 sin cuerpo, o 409 si tiene inscriptos activos
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        actividadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
