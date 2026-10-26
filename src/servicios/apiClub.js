async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`/api${ruta}`, {
    ...opciones,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(opciones.headers || {}),
    },
  });
  if (respuesta.status === 204) return null;
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok)
    throw new Error(datos.error || `Error HTTP ${respuesta.status}`);
  return datos;
}
const enviar = (metodo, ruta, datos) =>
  solicitar(ruta, {
    method: metodo,
    ...(datos === undefined ? {} : { body: JSON.stringify(datos) }),
  });

export const apiClub = {
  listarActividades: () => solicitar("/actividades"),
  obtenerActividad: (id) => solicitar(`/actividades/${id}`),
  crearActividad: (datos) => enviar("POST", "/actividades", datos),
  actualizarActividad: (id, datos) =>
    enviar("PUT", `/actividades/${id}`, datos),
  eliminarActividad: (id) => enviar("DELETE", `/actividades/${id}`),
  listarSocios: () => solicitar("/socios"),
  obtenerSocioPorDni: (dni) => solicitar(`/socios/dni/${dni}`),
  crearSocio: (datos) => enviar("POST", "/socios", datos),
  actualizarSocio: (id, datos) => enviar("PUT", `/socios/${id}`, datos),
  listarInscripciones: () => solicitar("/inscripciones"),
  inscripcionesDeSocio: (id) => solicitar(`/socios/${id}/inscripciones`),
  inscribir: (socioId, actividadId) =>
    enviar("POST", "/inscripciones", { socioId, actividadId }),
  darDeBaja: (id) => enviar("PUT", `/inscripciones/${id}/baja`),
};
