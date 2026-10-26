"use client";

import { useState } from "react";
import Icono from "@/componentes/Icono/Icono";
import { fotoDeActividad } from "@/utilidades/imagenes";
import estilos from "./ImagenActividad.module.css";

const iconos = {
  Fútbol: "futbol",
  Vóley: "voley",
  Básquet: "basquet",
  Natación: "natacion",
  Patín: "patin",
  Ajedrez: "ajedrez",
  Fitness: "fitness",
  Bienestar: "yoga",
};

export default function ImagenActividad({
  actividad,
  grande = false,
  etiqueta = false,
}) {
  const [fallo, setFallo] = useState(false);
  const imagen = fotoDeActividad(actividad.disciplina);

  return (
    <div className={`${estilos.contenedor} ${grande ? estilos.grande : ""}`}>
      {imagen && !fallo ? (
        <img
          src={imagen}
          alt={`Imagen ilustrativa de ${actividad.disciplina}`}
          onError={() => setFallo(true)}
          loading={grande ? "eager" : "lazy"}
          style={
            actividad.disciplina === "Fútbol"
              ? { objectPosition: "center 25%" }
              : undefined
          }
        />
      ) : (
        <Icono
          nombre={iconos[actividad.disciplina] || "actividad"}
          tamano={80}
        />
      )}
      {etiqueta && (
        <span className={estilos.etiqueta}>{actividad.disciplina}</span>
      )}
    </div>
  );
}
