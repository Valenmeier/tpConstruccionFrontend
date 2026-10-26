"use client";
import { useMemo, useState } from "react";
import TarjetaActividad from "@/componentes/TarjetaActividad/TarjetaActividad";
import { usarClub } from "@/contextos/ContextoClub";
import estilos from "./page.module.css";
export default function CatalogoSocios() {
  const { actividades, socioActual, datosCargados, errorCarga } = usarClub();
  const [disciplina, setDisciplina] = useState("");
  const disciplinas = [
    ...new Set(actividades.map((item) => item.disciplina)),
  ].sort();
  const visibles = useMemo(
    () =>
      actividades.filter(
        (item) => !disciplina || item.disciplina === disciplina,
      ),
    [actividades, disciplina],
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
        <span className="sobretitulo">MI CLUB · ACTIVIDADES</span>
        <h1 className="titulo-pagina">Elegí tu próximo desafío</h1>
        <p className="descripcion-pagina">
          {socioActual
            ? `Encontrá la próxima actividad ideal para vos, ${socioActual.nombre}.`
            : "Explorá las actividades. Para inscribirte, primero necesitás ser socio."}
        </p>
      </header>
      <div className={estilos.fila}>
        <div className="campo">
          <label htmlFor="disciplina">Filtrar por disciplina</label>
          <select
            id="disciplina"
            value={disciplina}
            onChange={(evento) => setDisciplina(evento.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {disciplinas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <span>{visibles.length} actividades disponibles en el catálogo</span>
      </div>
      {visibles.length ? (
        <div className="grilla-tarjetas">
          {visibles.map((item) => (
            <TarjetaActividad key={item.id} actividad={item} sector="socios" />
          ))}
        </div>
      ) : (
        <p className="mensaje mensaje--info">
          No hay actividades para esta disciplina.
        </p>
      )}
    </div>
  );
}
