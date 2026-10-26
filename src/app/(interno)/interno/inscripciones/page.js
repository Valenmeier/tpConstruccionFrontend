"use client";
import { useState } from "react";
import BannerDemo from "@/componentes/BannerDemo/BannerDemo";
import { usarClub } from "@/contextos/ContextoClub";
import { nombreCompleto } from "@/utilidades/formatos";
import estilos from "./page.module.css";
export default function GestionInscripciones() {
  const {
    socios,
    actividades,
    inscripcionesActivas,
    cupoDisponible,
    inscribirSocio,
    darDeBaja,
  } = usarClub();
  const [socioId, setSocioId] = useState("");
  const [actividadId, setActividadId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [aviso, setAviso] = useState(null);
  async function inscribir(evento) {
    evento.preventDefault();
    const resultado = await inscribirSocio(
      Number(socioId),
      Number(actividadId),
    );
    setAviso(
      resultado.ok
        ? { ok: true, texto: "Inscripción realizada correctamente." }
        : { ok: false, texto: resultado.error },
    );
  }
  const visibles = inscripcionesActivas.filter(
    (item) => !filtro || item.actividadId === Number(filtro),
  );
  return (
    <>
      <header className={estilos.cabecera}>
        <span className="sobretitulo">SECRETARÍA</span>
        <h1 className="titulo-pagina">Gestión de inscripciones</h1>
        <p className="descripcion-pagina">
          Anotá socios, comprobá cupos y administrá las bajas.
        </p>
      </header>
      <BannerDemo>
        Las reglas RN1 a RN5 se validan en el backend temporal o en Spring Boot,
        según la configuración.
      </BannerDemo>
      <section className={`panel ${estilos.formulario}`}>
        <h2>Nueva inscripción</h2>
        <form onSubmit={inscribir}>
          <div className={estilos.campos}>
            <div className="campo">
              <label htmlFor="socio">Socio</label>
              <select
                id="socio"
                value={socioId}
                required
                onChange={(evento) => setSocioId(evento.target.value)}
              >
                <option value="">Seleccioná un socio</option>
                {socios.map((socio) => (
                  <option value={socio.id} key={socio.id}>
                    {socio.apellido}, {socio.nombre} — {socio.dni}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="actividad">Actividad</label>
              <select
                id="actividad"
                value={actividadId}
                required
                onChange={(evento) => setActividadId(evento.target.value)}
              >
                <option value="">Seleccioná una actividad</option>
                {actividades.map((actividad) => (
                  <option value={actividad.id} key={actividad.id}>
                    {actividad.nombre} ({cupoDisponible(actividad)} cupos)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="formulario-acciones">
            <button type="submit" className="boton boton--principal">
              Inscribir socio
            </button>
          </div>
          {aviso && (
            <p
              style={{ marginTop: 15 }}
              className={`mensaje ${aviso.ok ? "mensaje--exito" : "mensaje--error"}`}
              role="status"
            >
              {aviso.texto}
            </p>
          )}
        </form>
      </section>
      <section className={`panel ${estilos.listado}`}>
        <div className={estilos.listaEncabezado}>
          <h2>
            Inscripciones activas{" "}
            <span className="etiqueta">{visibles.length}</span>
          </h2>
          <div className="campo">
            <label htmlFor="filtrar">Filtrar actividad</label>
            <select
              id="filtrar"
              value={filtro}
              onChange={(evento) => setFiltro(evento.target.value)}
            >
              <option value="">Todas las actividades</option>
              {actividades.map((actividad) => (
                <option key={actividad.id} value={actividad.id}>
                  {actividad.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tabla-desborde">
          <table className="tabla">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Actividad</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((item) => {
                const socio = socios.find((s) => s.id === item.socioId);
                const actividad = actividades.find(
                  (a) => a.id === item.actividadId,
                );
                return (
                  <tr key={item.id}>
                    <td>{nombreCompleto(socio)}</td>
                    <td>{actividad?.nombre || "Actividad eliminada"}</td>
                    <td>{item.fechaInscripcion}</td>
                    <td>
                      <span className="etiqueta">Activa</span>
                    </td>
                    <td>
                      <button
                        className={estilos.baja}
                        onClick={async () => {
                          if (
                            !window.confirm("¿Confirmar baja de inscripción?")
                          )
                            return;
                          const resultado = await darDeBaja(item.id);
                          setAviso(
                            resultado?.ok === false
                              ? { ok: false, texto: resultado.error }
                              : {
                                  ok: true,
                                  texto: "Inscripción dada de baja.",
                                },
                          );
                        }}
                      >
                        Dar de baja
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!visibles.length && (
          <p className={estilos.vacio}>
            No hay inscripciones activas para el filtro seleccionado.
          </p>
        )}
      </section>
    </>
  );
}
