// Modelo sencillo usado por el catálogo público.
// La API devuelve objetos comunes; esta clase les agrega un método.
export class Actividad {
  constructor(datos) {
    Object.assign(this, datos);
  }

  esAptaParaEdad(edad) {
    return edad >= this.edadMinima && edad <= this.edadMaxima;
  }
}
