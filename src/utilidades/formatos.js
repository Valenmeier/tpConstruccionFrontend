export const dinero = (monto) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto || 0);

export const esDniValido = (dni) => /^\d{7,8}$/.test(String(dni || ""));

export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  if (!fechaNacimiento || !hoy) return 0;

  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
  let edad = hoy.getFullYear() - anio;

  if (
    hoy.getMonth() + 1 < mes ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
  )
    edad--;
  return edad;
}

export function calcularCuotaMensual(actividades) {
  const total = actividades.reduce(
    (suma, actividad) => suma + Number(actividad.cuotaMensual || 0),
    0,
  );
  const descuento =
    actividades.length === 2 ? 0.1 : actividades.length >= 3 ? 0.15 : 0;
  return {
    subtotal: total,
    descuento,
    total: Math.round(total * (1 - descuento)),
  };
}

export const nombreCompleto = (socio) =>
  socio ? `${socio.nombre} ${socio.apellido}` : "";
