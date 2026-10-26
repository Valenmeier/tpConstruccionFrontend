"use client";

import Link from "next/link";
import ImagenActividad from "@/componentes/ImagenActividad/ImagenActividad";
import Icono from "@/componentes/Icono/Icono";
import { usarClub } from "@/contextos/ContextoClub";
import { dinero } from "@/utilidades/formatos";
import estilos from "./TarjetaActividad.module.css";

export default function TarjetaActividad({ actividad, sector = "publico" }) {
  const { cupoDisponible } = usarClub();
  const cupos = cupoDisponible(actividad);
  const rutaDetalle =
    sector === "socios"
      ? `/socios/actividades/${actividad.id}`
      : `/actividades/${actividad.id}`;

  return (
    <article className={estilos.tarjeta}>
      <ImagenActividad actividad={actividad} etiqueta />
      <div className={estilos.cuerpo}>
        <div className={estilos.cabecera}>
          <h3>{actividad.nombre}</h3>
          <span className={`etiqueta ${cupos ? "" : "etiqueta--error"}`}>
            {cupos ? `${cupos} cupos` : "Sin cupo"}
          </span>
        </div>
        <p className="texto-muted">{actividad.descripcion}</p>
        <div className={estilos.datos}>
          <span>
            <Icono nombre="calendario" tamano={16} />
            {actividad.dias}
          </span>
          <span>
            <Icono nombre="reloj" tamano={16} />
            {actividad.horario} hs
          </span>
          <span>
            <Icono nombre="usuarios" tamano={16} />
            {actividad.edadMinima} a {actividad.edadMaxima} años
          </span>
        </div>
        <div className={estilos.pie}>
          <strong>
            {dinero(actividad.cuotaMensual)} <small>/ mes</small>
          </strong>
          <Link
            className="boton boton--principal boton--chico"
            href={rutaDetalle}
          >
            Ver detalle <Icono nombre="flecha" tamano={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
