package ar.edu.siglo21.socioclub.service;

// Se lanza cuando el socio, la actividad o la inscripción no existe. La API responde 404.
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
