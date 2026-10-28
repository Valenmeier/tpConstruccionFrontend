package ar.edu.siglo21.socioclub.service;

// Se lanza cuando una regla del club rechaza la operación. La API responde 409.
public class ReglaNegocioException extends RuntimeException {

    // Código de la regla del enunciado ("RN1", "RN2"...). Puede ser null si no tiene código.
    private final String regla;

    public ReglaNegocioException(String mensaje) {
        this(mensaje, null);
    }

    public ReglaNegocioException(String mensaje, String regla) {
        super(mensaje);
        this.regla = regla;
    }

    public String getRegla() {
        return regla;
    }
}
