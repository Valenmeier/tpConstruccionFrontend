"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icono from "@/componentes/Icono/Icono";
import ImagenActividad from "@/componentes/ImagenActividad/ImagenActividad";
import { usarClub } from "@/contextos/ContextoClub";
import { dinero } from "@/utilidades/formatos";
import estilos from "./page.module.css";

function ContenidoDetalle() {
  const { id } = useParams();
  const {
    actividades,
    cupoDisponible,
    socioActual,
    datosCargados,
    errorCarga,
  } = usarClub();

  // La API carga los datos de manera asíncrona: no debemos mostrar un 404 antes de tiempo.
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

  if (!actividad) {
    return (
      <div className="contenedor pagina">
        <h1>No encontramos esta actividad</h1>
        <Link className="enlace-texto" href="/actividades">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const cupos = cupoDisponible(actividad);

  return (
    <div className="contenedor pagina">
      <Link href="/actividades" className="enlace-texto">
        <Icono nombre="volver" tamano={17} /> Volver a las actividades
      </Link>

      <div className={estilos.grilla}>
        <article>
          <ImagenActividad actividad={actividad} grande />
          <span className="sobretitulo">{actividad.disciplina}</span>
          <h1 className="titulo-pagina">{actividad.nombre}</h1>
          <p className="descripcion-pagina">{actividad.descripcion}</p>
          <dl className={estilos.datos}>
            <div>
              <dt>Días</dt>
              <dd>{actividad.dias}</dd>
            </div>
            <div>
              <dt>Horario</dt>
              <dd>{actividad.horario} hs</dd>
            </div>
            <div>
              <dt>Edades</dt>
              <dd>
                {actividad.edadMinima} a {actividad.edadMaxima} años
              </dd>
            </div>
            <div>
              <dt>Profesor/a</dt>
              <dd>{actividad.profesor}</dd>
            </div>
          </dl>
        </article>

        <aside className={`panel ${estilos.panel}`}>
          <span className="etiqueta">INFORMACIÓN PÚBLICA</span>
          <h2>Sumate al club</h2>
          <p className={estilos.precio}>
            {dinero(actividad.cuotaMensual)} <small>/ mes</small>
          </p>
          <p>
            {cupos > 0
              ? `${cupos} cupos disponibles de ${actividad.cupoMaximo}.`
              : "Esta actividad no tiene cupos disponibles."}
          </p>
          <p className="texto-muted">
            Podés consultar todas las actividades sin registrarte. Para
            inscribirte, necesitás ser socio.
          </p>
          {socioActual ? (
            <Link
              href={`/socios/actividades/${actividad.id}`}
              className="boton boton--principal boton--ancho"
            >
              Ir a inscribirme <Icono nombre="flecha" tamano={16} />
            </Link>
          ) : (
            <>
              <Link
                href={`/preinscripcion?actividad=${actividad.id}`}
                className="boton boton--principal boton--ancho"
              >
                Quiero asociarme <Icono nombre="flecha" tamano={16} />
              </Link>
              <Link
                href="/ingreso"
                className={`boton boton--secundario boton--ancho ${estilos.enlaceIngreso}`}
              >
                Ya soy socio: ingresar
              </Link>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function DetallePublico() {
  return (
    <Suspense
      fallback={
        <div className="contenedor pagina">
          <p>Cargando actividad...</p>
        </div>
      }
    >
      <ContenidoDetalle />
    </Suspense>
  );
}
