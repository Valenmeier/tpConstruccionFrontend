package ar.edu.siglo21.socioclub.service;

import ar.edu.siglo21.socioclub.model.Socio;
import ar.edu.siglo21.socioclub.repository.SocioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Semana 2: alta, edición, búsqueda por apellido y listado paginado de socios.
@Service
public class SocioService {

    private final SocioRepository socioRepository;

    public SocioService(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    public List<Socio> listar() {
        return socioRepository.findAllByOrderByApellidoAsc();
    }
}
