package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Inscripcion;
import ar.edu.siglo21.socioclub.repository.InscripcionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Semana 2: acá se programan las reglas RN1 a RN5 al inscribir a un socio.
@Service
public class InscripcionService {

    private final InscripcionRepository inscripcionRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository) {
        this.inscripcionRepository = inscripcionRepository;
    }

    public List<Inscripcion> listar() {
        return inscripcionRepository.findAll();
    }
}
