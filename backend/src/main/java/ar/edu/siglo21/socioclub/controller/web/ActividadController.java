package ar.edu.siglo21.socioclub.controller.web;

import ar.edu.siglo21.socioclub.model.Actividad;
import ar.edu.siglo21.socioclub.service.ActividadService;
import ar.edu.siglo21.socioclub.service.DatosInvalidosException;
import ar.edu.siglo21.socioclub.service.RecursoNoEncontradoException;
import ar.edu.siglo21.socioclub.service.ReglaNegocioException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// @Controller = cada método devuelve el nombre de una vista Thymeleaf (templates/...html).
@Controller
@RequestMapping("/secretaria/actividades")
public class ActividadController {

    private static final String VISTA_FORMULARIO = "actividades/formulario";
    private static final String VOLVER_AL_LISTADO = "redirect:/secretaria/actividades";

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("actividades", actividadService.listar(null));
        return "actividades/lista";
    }

    @GetMapping("/nueva")
    public String nueva(Model model) {
        model.addAttribute("actividad", new Actividad());
        return VISTA_FORMULARIO;
    }

    @GetMapping("/{id}/editar")
    public String editar(@PathVariable Long id, Model model, RedirectAttributes redireccion) {
        try {
            model.addAttribute("actividad", actividadService.buscarPorId(id));
            return VISTA_FORMULARIO;
        } catch (RecursoNoEncontradoException e) {
            redireccion.addFlashAttribute("error", e.getMessage());
            return VOLVER_AL_LISTADO;
        }
    }

    // Recibe el formulario (alta o edición). Spring arma el objeto Actividad con los campos del form.
    @PostMapping("/guardar")
    public String guardar(@ModelAttribute("actividad") Actividad actividad, BindingResult resultado,
                          Model model, RedirectAttributes redireccion) {
        if (resultado.hasErrors()) {
            model.addAttribute("error", "Revisá los valores numéricos.");
            return VISTA_FORMULARIO;
        }
        try {
            if (actividad.getId() == null) {
                actividadService.crear(actividad);
                redireccion.addFlashAttribute("exito", "Actividad creada.");
            } else {
                actividadService.actualizar(actividad.getId(), actividad);
                redireccion.addFlashAttribute("exito", "Actividad actualizada.");
            }
            return VOLVER_AL_LISTADO;
        } catch (DatosInvalidosException | ReglaNegocioException e) {
            // La regla vive en el servicio; el controlador solo muestra el mensaje en la vista.
            model.addAttribute("error", e.getMessage());
            return VISTA_FORMULARIO;
        } catch (RecursoNoEncontradoException e) {
            redireccion.addFlashAttribute("error", e.getMessage());
            return VOLVER_AL_LISTADO;
        }
    }

    // Los formularios HTML solo envían GET y POST: por eso la baja es un POST (en la API es DELETE).
    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes redireccion) {
        try {
            actividadService.eliminar(id);
            redireccion.addFlashAttribute("exito", "Actividad eliminada.");
        } catch (ReglaNegocioException | RecursoNoEncontradoException e) {
            redireccion.addFlashAttribute("error", e.getMessage());
        }
        return VOLVER_AL_LISTADO;
    }
}
