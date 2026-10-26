import { obtenerBaseDatos } from "./baseDatos";

export async function listarActividadesParaServidor() {
  if (process.env.MODO_API === "spring") {
    const base = process.env.SPRING_API_URL || "http://localhost:8080";
    const respuesta = await fetch(
      `${base.replace(/\/$/, "")}/api/actividades`,
      { cache: "no-store" },
    );
    if (!respuesta.ok) throw new Error("No se pudo consultar Spring Boot.");
    return respuesta.json();
  }
  const [filas] = await obtenerBaseDatos().execute(`
    SELECT a.id, a.nombre, a.disciplina, a.dias, a.horario,
           a.cupo_maximo AS cupoMaximo, a.cuota_mensual AS cuotaMensual,
           a.cupo_maximo - COUNT(i.id) AS cupoDisponible
    FROM actividad a
    LEFT JOIN inscripcion i ON i.actividad_id=a.id AND i.estado='ACTIVA'
    WHERE a.activa=1
    GROUP BY a.id
    ORDER BY a.nombre
  `);
  return filas;
}
