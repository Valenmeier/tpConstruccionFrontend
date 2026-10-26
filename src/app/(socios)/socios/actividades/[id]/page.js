"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icono from "@/componentes/Icono/Icono";
import ImagenActividad from "@/componentes/ImagenActividad/ImagenActividad";
import { usarClub } from "@/contextos/ContextoClub";
import { dinero } from "@/utilidades/formatos";
import estilos from "./page.module.css";
function ContenidoDetalleActividad() {
  const { id } = useParams();
  const [mensaje, setMensaje] = useState(null);
  const {
    actividades,
    socioActual,
    cupoDisponible,
    actividadesDeSocio,
    inscribirSocio,
    datosCargados,
    errorCarga,
  } = usarClub();
  // Primero esperamos los datos; una lista vacía durante la carga no significa 404.
  if (!datosCargados) {
    return (
      <div className="contenedor pagina">
        <p role="status">Cargando actividad...</p>
      </div>
    );
  }
  if (errorCarga) {
    return (
      <div className="contenedor pagina">
        <p role="alert">No pudimos cargar las actividades: {errorCarga}</p>
      </div>
    );
  }

  const actividad = actividades.find((item) => Number(item.id) === Number(id));
  if (!actividad)
    return (
      <div className="contenedor pagina">
        <h1>Actividad no encontrada</h1>
        <Link className="enlace-texto" href="/socios/actividades">
          Volver al catálogo
        </Link>
      </div>
    );
  const cupos = cupoDisponible(actividad);
  const yaInscripto = socioActual
    ? actividadesDeSocio(socioActual.id).some(
        (item) => item.actividadId === actividad.id,
      )
    : false;
  async function inscribirme() {
    if (!socioActual) return;
    const resultado = await inscribirSocio(socioActual.id, actividad.id);
    setMensaje({
      ok: resultado.ok,
      texto: resultado.ok
        ? "¡Listo! Ya estás inscripto en esta actividad."
        : resultado.error,
    });
  }
  return (
    <div className="contenedor pagina">
      <Link href="/socios/actividades" className="enlace-texto">
        <Icono nombre="volver" tamano={17} /> Volver a actividades
      </Link>
      <div className={estilos.grilla}>
        <div>
          <ImagenActividad actividad={actividad} grande />
          <span className="sobretitulo">{actividad.disciplina}</span>
          <h1 className="titulo-pagina">{actividad.nombre}</h1>
          <p className={estilos.descripcion}>{actividad.descripcion}</p>
          <h2>Sobre esta actividad</h2>
          <div className={estilos.datos}>
            <div>
              <Icono nombre="calendario" />
              <span>
                <strong>Días</strong>
                {actividad.dias}
              </span>
            </div>
            <div>
              <Icono nombre="reloj" />
              <span>
                <strong>Horario</strong>
                {actividad.horario} hs
              </span>
            </div>
            <div>
              <Icono nombre="usuarios" />
              <span>
                <strong>Edades</strong>
                {actividad.edadMinima} a {actividad.edadMaxima} años
              </span>
            </div>
            <div>
              <Icono nombre="usuario" />
              <span>
                <strong>Profesor/a</strong>
                {actividad.profesor}
              </span>
            </div>
          </div>
        </div>
        <aside className={estilos.panel}>
          <span className="etiqueta">INSCRIPCIONES</span>
          <h2>Sumate a la actividad</h2>
          <div className={estilos.precio}>
            <strong>{dinero(actividad.cuotaMensual)}</strong>
            <span>/ mes</span>
          </div>
          <p>
            Cuota individual estimada. Si realizás 2 o 3 actividades podés
            acceder a una bonificación.
          </p>
          <div className={estilos.cupo}>
            <span>Cupos disponibles</span>
            <strong>
              {cupos} / {actividad.cupoMaximo}
            </strong>
          </div>
          <div className={estilos.barra}>
            <span
              style={{ width: `${(cupos / actividad.cupoMaximo) * 100}%` }}
            />
          </div>
          {!socioActual ? (
            <>
              <p className="mensaje mensaje--info">
                Primero tenés que asociarte al club para inscribirte.
              </p>
              <Link
                className="boton boton--principal boton--ancho"
                href={`/preinscripcion?actividad=${actividad.id}`}
              >
                Registrarme como socio <Icono nombre="flecha" tamano={17} />
              </Link>
              <Link className={estilos.textoIngreso} href="/ingreso">
                Ya soy socio: ingresar
              </Link>
            </>
          ) : yaInscripto ? (
            <>
              <p className="mensaje mensaje--exito">
                Ya estás inscripto en esta actividad.
              </p>
              <Link
                href="/socios/mis-actividades"
                className="boton boton--secundario boton--ancho"
              >
                Ver mis actividades
              </Link>
            </>
          ) : (
            <button
              type="button"
              disabled={cupos === 0}
              className="boton boton--principal boton--ancho"
              onClick={inscribirme}
            >
              {cupos === 0 ? "Sin cupo disponible" : "Inscribirme ahora"}{" "}
              <Icono nombre="flecha" tamano={17} />
            </button>
          )}
          {mensaje && (
            <p
              role="status"
              className={`mensaje ${mensaje.ok ? "mensaje--exito" : "mensaje--error"}`}
            >
              {mensaje.texto}
            </p>
          )}
          <small>
            Las reglas de negocio se validan en la API, sea temporal o Spring
            Boot.
          </small>
        </aside>
      </div>
    </div>
  );
}

// useParams() necesita un límite Suspense en rutas dinámicas de Next 16.
// Mostramos un fallback pequeño mientras se resuelve el ID de la URL.
export default function DetalleActividad() {
  return (
    <Suspense
      fallback={
        <div className="contenedor pagina">
          <p role="status">Cargando actividad...</p>
        </div>
      }
    >
      <ContenidoDetalleActividad />
    </Suspense>
  );
}
