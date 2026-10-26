import { obtenerBaseDatos } from "./baseDatos";

class ErrorApi extends Error {
  constructor(estado, mensaje, regla) {
    super(mensaje);
    this.estado = estado;
    this.regla = regla;
  }
}
const error = (estado, mensaje, regla) => {
  throw new ErrorApi(estado, mensaje, regla);
};
const validoId = (texto) =>
  Number.isSafeInteger(Number(texto)) && Number(texto) > 0;
const dniValido = (dni) => /^\d{7,8}$/.test(String(dni || ""));
const columnasActividad = `a.id, a.nombre, a.disciplina, a.profesor, a.dias, a.horario,
 a.edad_minima AS edadMinima, a.edad_maxima AS edadMaxima,
 a.cupo_maximo AS cupoMaximo, a.cuota_mensual AS cuotaMensual,
 a.descripcion, (a.cupo_maximo -
 (SELECT COUNT(*) FROM inscripcion i WHERE i.actividad_id=a.id AND i.estado='ACTIVA')) AS cupoDisponible`;
const columnasSocio = `s.id, s.dni, s.nombre, s.apellido, s.fecha_nacimiento AS fechaNacimiento,
 s.email, s.telefono, s.estado_cuota AS estadoCuota`;
const columnasInscripcion = `i.id, i.socio_id AS socioId, i.actividad_id AS actividadId,
 i.fecha_inscripcion AS fechaInscripcion, i.estado`;

async function consulta(sql, parametros = [], db = obtenerBaseDatos()) {
  const [filas] = await db.execute(sql, parametros);
  return filas;
}
async function actividadPorId(id, db = obtenerBaseDatos()) {
  const filas = await consulta(
    `SELECT ${columnasActividad} FROM actividad a WHERE a.id=? AND a.activa=1`,
    [id],
    db,
  );
  if (!filas.length) error(404, "Actividad no encontrada.");
  return filas[0];
}
async function socioPorId(id, db = obtenerBaseDatos()) {
  const filas = await consulta(
    `SELECT ${columnasSocio} FROM socio s WHERE s.id=?`,
    [id],
    db,
  );
  if (!filas.length) error(404, "Socio no encontrado.");
  return filas[0];
}
function revisarActividad(datos) {
  for (const campo of ["nombre", "disciplina", "profesor", "dias", "horario"]) {
    if (!String(datos[campo] || "").trim()) error(400, `Completá ${campo}.`);
  }
  for (const campo of [
    "edadMinima",
    "edadMaxima",
    "cupoMaximo",
    "cuotaMensual",
  ]) {
    if (
      datos[campo] === "" ||
      datos[campo] === null ||
      !Number.isFinite(Number(datos[campo]))
    )
      error(400, `Valor inválido: ${campo}.`);
  }
  if (
    Number(datos.edadMinima) < 0 ||
    Number(datos.edadMaxima) < Number(datos.edadMinima)
  )
    error(400, "Rango de edades inválido.");
  if (Number(datos.cupoMaximo) < 1 || Number(datos.cuotaMensual) < 0)
    error(400, "Cupo o cuota inválidos.");
}
function revisarSocio(datos) {
  if (!dniValido(datos.dni))
    error(400, "El DNI debe tener 7 u 8 dígitos sin puntos.", "RN7");
  if (!datos.nombre?.trim() || !datos.apellido?.trim())
    error(400, "El nombre y apellido son obligatorios.");
  if (!/^\S+@\S+\.\S+$/.test(datos.email || "")) error(400, "Correo inválido.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaNacimiento || "") ||
    Number.isNaN(Date.parse(datos.fechaNacimiento)) ||
    datos.fechaNacimiento > new Date().toISOString().slice(0, 10)
  )
    error(400, "Fecha de nacimiento inválida.");
  if (!["AL_DIA", "MOROSO"].includes(datos.estadoCuota || "AL_DIA"))
    error(400, "Estado de cuota inválido.");
}
function edad(fecha) {
  const hoy = new Date();
  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-").map(Number);
  return (
    hoy.getFullYear() -
    anio -
    (hoy.getMonth() + 1 < mes ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
      ? 1
      : 0)
  );
}
const json = (cuerpo, estado = 200) => ({ cuerpo, estado });

async function nuevaActividad(datos) {
  revisarActividad(datos);
  const filas = await consulta(
    `INSERT INTO actividad (nombre,disciplina,profesor,dias,horario,edad_minima,edad_maxima,cupo_maximo,cuota_mensual,descripcion)
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      datos.nombre,
      datos.disciplina,
      datos.profesor,
      datos.dias,
      datos.horario,
      Number(datos.edadMinima),
      Number(datos.edadMaxima),
      Number(datos.cupoMaximo),
      Number(datos.cuotaMensual),
      datos.descripcion || "",
    ],
  );
  return json(await actividadPorId(filas.insertId), 201);
}
async function modificarActividad(id, datos) {
  await actividadPorId(id);
  revisarActividad(datos);
  const act = await actividadPorId(id);
  const ocupados = act.cupoMaximo - act.cupoDisponible;
  if (Number(datos.cupoMaximo) < ocupados)
    error(
      409,
      "El cupo máximo no puede ser menor a la cantidad de inscriptos activos.",
    );
  await consulta(
    `UPDATE actividad SET nombre=?,disciplina=?,profesor=?,dias=?,horario=?,edad_minima=?,edad_maxima=?,cupo_maximo=?,cuota_mensual=?,descripcion=? WHERE id=?`,
    [
      datos.nombre,
      datos.disciplina,
      datos.profesor,
      datos.dias,
      datos.horario,
      Number(datos.edadMinima),
      Number(datos.edadMaxima),
      Number(datos.cupoMaximo),
      Number(datos.cuotaMensual),
      datos.descripcion || "",
      id,
    ],
  );
  return json(await actividadPorId(id));
}
async function borrarActividad(id) {
  const conexion = await obtenerBaseDatos().getConnection();
  try {
    await conexion.beginTransaction();
    const filas = await consulta(
      "SELECT id FROM actividad WHERE id=? AND activa=1 FOR UPDATE",
      [id],
      conexion,
    );
    if (!filas.length) error(404, "Actividad no encontrada.");
    const [ocupacion] = await consulta(
      "SELECT COUNT(*) AS total FROM inscripcion WHERE actividad_id=? AND estado='ACTIVA'",
      [id],
      conexion,
    );
    if (ocupacion.total)
      error(409, "No se puede eliminar una actividad con inscriptos activos.");
    // Baja lógica de actividad: conserva historial de inscripciones en estado BAJA.
    await consulta("UPDATE actividad SET activa=0 WHERE id=?", [id], conexion);
    await conexion.commit();
    return json(null, 204);
  } catch (e) {
    await conexion.rollback();
    throw e;
  } finally {
    conexion.release();
  }
}
async function guardarSocio(datos, id) {
  revisarSocio(datos);
  const existente = await consulta("SELECT id FROM socio WHERE dni=?", [
    datos.dni,
  ]);
  if (existente.length && existente[0].id !== Number(id))
    error(409, "Ya existe un socio con ese DNI.");
  if (id) {
    await socioPorId(id);
    await consulta(
      "UPDATE socio SET dni=?,nombre=?,apellido=?,fecha_nacimiento=?,email=?,telefono=?,estado_cuota=? WHERE id=?",
      [
        datos.dni,
        datos.nombre,
        datos.apellido,
        datos.fechaNacimiento,
        datos.email,
        datos.telefono || "",
        datos.estadoCuota || "AL_DIA",
        id,
      ],
    );
    return json(await socioPorId(id));
  }
  const fila = await consulta(
    "INSERT INTO socio(dni,nombre,apellido,fecha_nacimiento,email,telefono,estado_cuota) VALUES(?,?,?,?,?,?,?)",
    [
      datos.dni,
      datos.nombre,
      datos.apellido,
      datos.fechaNacimiento,
      datos.email,
      datos.telefono || "",
      datos.estadoCuota || "AL_DIA",
    ],
  );
  return json(await socioPorId(fila.insertId), 201);
}
async function nuevaInscripcion(datos) {
  const socioId = Number(datos?.socioId),
    actividadId = Number(datos?.actividadId);
  if (!validoId(socioId) || !validoId(actividadId))
    error(400, "Seleccioná un socio y una actividad.");
  const conexion = await obtenerBaseDatos().getConnection();
  try {
    await conexion.beginTransaction();
    // Se bloquean las filas para no exceder el cupo ante dos inscripciones simultáneas.
    const actividad = await consulta(
      "SELECT * FROM actividad WHERE id=? AND activa=1 FOR UPDATE",
      [actividadId],
      conexion,
    );
    const socio = await consulta(
      "SELECT * FROM socio WHERE id=? FOR UPDATE",
      [socioId],
      conexion,
    );
    if (!actividad.length || !socio.length)
      error(404, "No se encontró el socio o la actividad.");
    const ocupacion = await consulta(
      "SELECT COUNT(*) AS total FROM inscripcion WHERE actividad_id=? AND estado='ACTIVA'",
      [actividadId],
      conexion,
    );
    if (ocupacion[0].total >= actividad[0].cupo_maximo)
      error(409, "La actividad no tiene cupo disponible", "RN1");
    const duplicado = await consulta(
      "SELECT id FROM inscripcion WHERE socio_id=? AND actividad_id=? AND estado='ACTIVA'",
      [socioId, actividadId],
      conexion,
    );
    if (duplicado.length)
      error(409, "El socio ya está inscripto en esta actividad", "RN2");
    const anios = edad(socio[0].fecha_nacimiento);
    if (anios < actividad[0].edad_minima || anios > actividad[0].edad_maxima)
      error(
        409,
        `Edad permitida: ${actividad[0].edad_minima} a ${actividad[0].edad_maxima} años`,
        "RN3",
      );
    if (socio[0].estado_cuota === "MOROSO")
      error(409, "Debe regularizar su cuota en secretaría", "RN4");
    const otras = await consulta(
      "SELECT COUNT(*) AS total FROM inscripcion WHERE socio_id=? AND estado='ACTIVA'",
      [socioId],
      conexion,
    );
    if (otras[0].total >= 3)
      error(409, "Alcanzó el máximo de 3 actividades", "RN5");
    const alta = await consulta(
      "INSERT INTO inscripcion(socio_id,actividad_id,fecha_inscripcion,estado) VALUES(?,?,CURRENT_DATE(),'ACTIVA')",
      [socioId, actividadId],
      conexion,
    );
    await conexion.commit();
    const [fila] = await consulta(
      `SELECT ${columnasInscripcion} FROM inscripcion i WHERE i.id=?`,
      [alta.insertId],
    );
    return json(fila, 201);
  } catch (e) {
    await conexion.rollback();
    throw e;
  } finally {
    conexion.release();
  }
}
async function bajaInscripcion(id) {
  const filas = await consulta("SELECT id FROM inscripcion WHERE id=?", [id]);
  if (!filas.length) error(404, "Inscripción no encontrada.");
  await consulta("UPDATE inscripcion SET estado='BAJA' WHERE id=?", [id]);
  const [fila] = await consulta(
    `SELECT ${columnasInscripcion} FROM inscripcion i WHERE i.id=?`,
    [id],
  );
  return json(fila);
}

export async function atenderApiTemporal(request, ruta) {
  const metodo = request.method;
  const partes = ruta.filter(Boolean);
  const clave = partes.join("/");
  const url = new URL(request.url);
  const datos = ["POST", "PUT"].includes(metodo)
    ? await request.json().catch(() => error(400, "JSON inválido."))
    : null;

  if (metodo === "GET" && clave === "salud") {
    await consulta("SELECT 1 AS ok");
    return json({ ok: true, modo: "temporal", base: "MySQL" });
  }
  if (clave === "actividades") {
    if (metodo === "GET") {
      const disciplina = url.searchParams.get("disciplina");
      const filas = await consulta(
        `SELECT ${columnasActividad} FROM actividad a WHERE a.activa=1 ${disciplina ? "AND a.disciplina=?" : ""} ORDER BY a.id`,
        disciplina ? [disciplina] : [],
      );
      return json(filas);
    }
    if (metodo === "POST") return nuevaActividad(datos);
  }
  if (
    partes[0] === "actividades" &&
    validoId(partes[1]) &&
    partes.length === 2
  ) {
    if (metodo === "GET") return json(await actividadPorId(Number(partes[1])));
    if (metodo === "PUT") return modificarActividad(Number(partes[1]), datos);
    if (metodo === "DELETE") return borrarActividad(Number(partes[1]));
  }
  if (metodo === "GET" && clave === "socios") {
    const apellido = url.searchParams.get("apellido");
    const filas = await consulta(
      `SELECT ${columnasSocio} FROM socio s ${apellido ? "WHERE s.apellido LIKE ?" : ""} ORDER BY s.apellido, s.nombre`,
      apellido ? [`%${apellido}%`] : [],
    );
    return json(filas);
  }
  if (metodo === "POST" && clave === "socios") return guardarSocio(datos);
  if (
    metodo === "PUT" &&
    partes[0] === "socios" &&
    validoId(partes[1]) &&
    partes.length === 2
  )
    return guardarSocio(datos, Number(partes[1]));
  if (
    metodo === "GET" &&
    partes[0] === "socios" &&
    partes[1] === "dni" &&
    dniValido(partes[2]) &&
    partes.length === 3
  ) {
    const socios = await consulta(
      `SELECT ${columnasSocio} FROM socio s WHERE s.dni=?`,
      [partes[2]],
    );
    if (!socios.length) error(404, "Socio no encontrado.");
    return json(socios[0]);
  }
  if (
    metodo === "GET" &&
    partes[0] === "socios" &&
    validoId(partes[1]) &&
    partes[2] === "inscripciones" &&
    partes.length === 3
  ) {
    await socioPorId(Number(partes[1]));
    const filas = await consulta(
      `SELECT ${columnasInscripcion} FROM inscripcion i WHERE i.socio_id=? AND i.estado='ACTIVA' ORDER BY i.id`,
      [Number(partes[1])],
    );
    return json(filas);
  }
  if (metodo === "GET" && clave === "inscripciones") {
    return json(
      await consulta(
        `SELECT ${columnasInscripcion} FROM inscripcion i ORDER BY i.id`,
      ),
    );
  }
  if (metodo === "POST" && clave === "inscripciones")
    return nuevaInscripcion(datos);
  if (
    metodo === "PUT" &&
    partes[0] === "inscripciones" &&
    validoId(partes[1]) &&
    partes[2] === "baja" &&
    partes.length === 3
  )
    return bajaInscripcion(Number(partes[1]));
  error(404, "Endpoint no encontrado.");
}

export function normalizarError(errorCapturado) {
  if (errorCapturado instanceof ErrorApi) {
    return {
      estado: errorCapturado.estado,
      cuerpo: {
        error: errorCapturado.message,
        ...(errorCapturado.regla ? { regla: errorCapturado.regla } : {}),
      },
    };
  }
  if (errorCapturado.code === "ER_DUP_ENTRY")
    return {
      estado: 409,
      cuerpo: { error: "Ya existe un registro con esos datos." },
    };
  console.error("API temporal:", errorCapturado);
  return {
    estado: 500,
    cuerpo: {
      error:
        "No se pudo consultar la base de datos. Revisá la configuración del servidor.",
    },
  };
}
