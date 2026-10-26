"use client";
import { useMemo, useState } from "react";
import TarjetaActividad from "@/componentes/TarjetaActividad/TarjetaActividad";
import Icono from "@/componentes/Icono/Icono";
import { usarClub } from "@/contextos/ContextoClub";
import { Actividad } from "@/utilidades/Actividad";
import estilos from "./page.module.css";

export default function ActividadesPublicas() {
  const { actividades, datosCargados, errorCarga } = usarClub();
  const [disciplina, setDisciplina] = useState("");
  const [edad, setEdad] = useState("");
  // Convertimos los datos de la API en objetos de la clase Actividad.
  const listaActividades = useMemo(
    () => actividades.map((datos) => new Actividad(datos)),
    [actividades],
  );
  const disciplinas = [
    ...new Set(listaActividades.map((item) => item.disciplina)),
  ].sort();
  const filtradas = useMemo(
    () =>
      listaActividades.filter(
        (item) =>
          (!disciplina || item.disciplina === disciplina) &&
          (!edad || item.esAptaParaEdad(Number(edad))),
      ),
    [listaActividades, disciplina, edad],
  );
  if (!datosCargados)
    return (
      <div className="contenedor pagina">
        <p role="status">Cargando actividades...</p>
      </div>
    );
  if (errorCarga)
    return (
      <div className="contenedor pagina">
        <p role="alert">No pudimos cargar las actividades: {errorCarga}</p>
      </div>
    );
  return (
    <div className="contenedor pagina">
      <header className="encabezado-seccion">
        <span className="sobretitulo">MOVETE A TU MANERA</span>
        <h1 className="titulo-pagina">Actividades para todos.</h1>
        <p className="descripcion-pagina">
          Encontrá lo que te gusta. Conocé los horarios, profes y precios antes
          de elegir tu próxima actividad.
        </p>
      </header>
      <div className={estilos.filtros}>
        <div className="campo">
          <label htmlFor="disciplina">Disciplina</label>
          <select
            id="disciplina"
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {disciplinas.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="edad">Edad de quien participará</label>
          <input
            id="edad"
            type="number"
            min="0"
            max="110"
            placeholder="Ej. 15"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
        </div>
        <button
          className="boton boton--secundario"
          type="button"
          onClick={() => {
            setDisciplina("");
            setEdad("");
          }}
        >
          Limpiar filtros
        </button>
      </div>
      <div className={estilos.resultados}>
        <strong>{filtradas.length} actividades</strong>
        <span>Precios mensuales estimados</span>
      </div>
      {filtradas.length ? (
        <div className="grilla-tarjetas">
          {filtradas.map((actividad) => (
            <TarjetaActividad key={actividad.id} actividad={actividad} />
          ))}
        </div>
      ) : (
        <div className={estilos.vacio}>
          <Icono nombre="buscar" tamano={30} />
          <h2>No encontramos actividades</h2>
          <p>Probá con otra disciplina o edad.</p>
        </div>
      )}
    </div>
  );
}
