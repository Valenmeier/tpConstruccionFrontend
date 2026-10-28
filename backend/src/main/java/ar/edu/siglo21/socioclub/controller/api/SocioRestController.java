package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.service.SocioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/socios")
public class SocioRestController {

    private final SocioService socioService;

    public SocioRestController(SocioService socioService) {
        this.socioService = socioService;
    }

    // GET /api/socios
    @GetMapping
    public List<Socio> listar() {
        return socioService.listar();
    }
}
