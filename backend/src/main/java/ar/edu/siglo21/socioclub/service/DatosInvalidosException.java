package ar.edu.siglo21.socioclub.service;

// Se lanza cuando faltan datos o tienen valores imposibles. La API responde 400.
public class DatosInvalidosException extends RuntimeException {

    public DatosInvalidosException(String mensaje) {
        super(mensaje);
    }
}
