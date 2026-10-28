package ar.edu.siglo21.socioclub.controller.api;

import ar.edu.siglo21.socioclub.service.DatosInvalidosException;
import ar.edu.siglo21.socioclub.service.RecursoNoEncontradoException;
import ar.edu.siglo21.socioclub.service.ReglaNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Atrapa las excepciones que lanza el servicio y las convierte en una respuesta HTTP con JSON.
// Ejemplo: {"error": "No se puede eliminar una actividad con inscriptos activos."}
// Solo aplica a los controladores REST de este paquete.
@RestControllerAdvice(basePackages = "ar.edu.siglo21.socioclub.controller.api")
public class ManejadorErroresApi {

    // 404 Not Found: no existe lo que se busca.
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> noEncontrado(RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(armarError(e.getMessage(), null));
    }

    // 400 Bad Request: faltan datos o tienen valores inválidos.
    @ExceptionHandler(DatosInvalidosException.class)
    public ResponseEntity<Map<String, String>> datosInvalidos(DatosInvalidosException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(armarError(e.getMessage(), null));
    }

    // 409 Conflict: una regla de negocio rechazó la operación.
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<Map<String, String>> reglaNegocio(ReglaNegocioException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(armarError(e.getMessage(), e.getRegla()));
    }

    private Map<String, String> armarError(String mensaje, String regla) {
        Map<String, String> cuerpo = new HashMap<>();
        cuerpo.put("error", mensaje);
        if (regla != null) {
            cuerpo.put("regla", regla);
        }
        return cuerpo;
    }
}
