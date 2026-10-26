"use client";

import { useState } from "react";
import Campo from "@/componentes/Campo/Campo";
import BannerDemo from "@/componentes/BannerDemo/BannerDemo";
import { usarClub } from "@/contextos/ContextoClub";
import { dinero } from "@/utilidades/formatos";
import estilos from "./page.module.css";

const inicial = {
  nombre: "",
  disciplina: "",
  profesor: "",
  dias: "",
  horario: "",
  edadMinima: 6,
  edadMaxima: 99,
  cupoMaximo: 20,
  cuotaMensual: 15000,
  descripcion: "",
};
const campos = [
  ["nombre", "Nombre", "text"],
  ["disciplina", "Disciplina", "text"],
  ["profesor", "Profesor/a", "text"],
  ["dias", "Días", "text"],
  ["horario", "Horario", "text"],
  ["edadMinima", "Edad mínima", "number"],
  ["edadMaxima", "Edad máxima", "number"],
  ["cupoMaximo", "Cupo máximo", "number"],
  ["cuotaMensual", "Cuota mensual ($)", "number"],
];

export default function GestionActividades() {
  const { actividades, cupoDisponible, guardarActividad, eliminarActividad } =
    usarClub();
  const [formulario, setFormulario] = useState(null);
  const [aviso, setAviso] = useState(null);

  function actualizar(evento) {
    setFormulario((actual) => ({
      ...actual,
      [evento.target.name]: evento.target.value,
    }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    const resultado = await guardarActividad(formulario);
    setAviso({
      ok: resultado.ok,
      texto: resultado.ok ? "Actividad guardada." : resultado.error,
    });
    if (resultado.ok) setFormulario(null);
  }

  async function eliminar(actividad) {
    if (!window.confirm(`¿Eliminar ${actividad.nombre}?`)) return;
    const resultado = await eliminarActividad(actividad.id);
    setAviso({
      ok: resultado.ok,
      texto: resultado.ok ? "Actividad eliminada." : resultado.error,
    });
  }

  return (
    <>
      <header className={estilos.cabecera}>
        <div>
          <span className="sobretitulo">Secretaría</span>
          <h1 className="titulo-pagina">Gestión de actividades</h1>
          <p className="descripcion-pagina">
            Administrá el catálogo y los cupos disponibles.
          </p>
        </div>
        <button
          className="boton boton--principal"
          onClick={() => {
            setFormulario({ ...inicial });
            setAviso(null);
          }}
        >
          Nueva actividad
        </button>
      </header>

      <BannerDemo />
      {aviso && (
        <p
          role="status"
          className={`mensaje ${aviso.ok ? "mensaje--exito" : "mensaje--error"}`}
        >
          {aviso.texto}
        </p>
      )}

      {formulario && (
        <form className={`panel ${estilos.formulario}`} onSubmit={guardar}>
          <div className={estilos.formTitulo}>
            <h2>{formulario.id ? "Editar actividad" : "Nueva actividad"}</h2>
            <button
              type="button"
              className="boton boton--secundario boton--chico"
              onClick={() => setFormulario(null)}
            >
              Cancelar
            </button>
          </div>
          <div className="formulario-grilla">
            {campos.map(([nombre, etiqueta, tipo]) => (
              <Campo
                key={nombre}
                nombre={nombre}
                etiqueta={etiqueta}
                tipo={tipo}
                valor={formulario[nombre]}
                alCambiar={actualizar}
                required
                min={tipo === "number" ? 0 : undefined}
              />
            ))}
            <Campo
              nombre="descripcion"
              etiqueta="Descripción"
              tipo="textarea"
              valor={formulario.descripcion || ""}
              alCambiar={actualizar}
            />
          </div>
          <div className="formulario-acciones">
            <button type="submit" className="boton boton--principal">
              Guardar actividad
            </button>
          </div>
        </form>
      )}

      <section className={`panel ${estilos.tablaPanel}`}>
        <div className={estilos.resumen}>
          {actividades.length} actividades registradas
        </div>
        <div className="tabla-desborde">
          <table className="tabla">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Horario</th>
                <th>Cupo</th>
                <th>Cuota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((actividad) => (
                <tr key={actividad.id}>
                  <td>
                    <div className={estilos.nombre}>
                      <div>
                        <strong>{actividad.nombre}</strong>
                        <small>{actividad.disciplina}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {actividad.dias}
                    <br />
                    <span className="texto-muted">{actividad.horario} hs</span>
                  </td>
                  <td>
                    <span
                      className={
                        cupoDisponible(actividad)
                          ? "etiqueta"
                          : "etiqueta etiqueta--error"
                      }
                    >
                      {cupoDisponible(actividad)}/{actividad.cupoMaximo} libres
                    </span>
                  </td>
                  <td>{dinero(actividad.cuotaMensual)}</td>
                  <td>
                    <div className={estilos.acciones}>
                      <button
                        className="boton boton--secundario boton--chico"
                        onClick={() => setFormulario({ ...actividad })}
                      >
                        Editar
                      </button>
                      <button
                        className={estilos.eliminar}
                        onClick={() => eliminar(actividad)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
