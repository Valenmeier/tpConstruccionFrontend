"use client";

import { useEffect, useState } from "react";
import Campo from "@/componentes/Campo/Campo";
import BannerDemo from "@/componentes/BannerDemo/BannerDemo";
import { usarClub } from "@/contextos/ContextoClub";
import { calcularEdad } from "@/utilidades/formatos";
import estilos from "./page.module.css";

const inicial = {
  dni: "",
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  email: "",
  telefono: "",
  estadoCuota: "AL_DIA",
};
const campos = [
  ["nombre", "Nombre", "text"],
  ["apellido", "Apellido", "text"],
  ["dni", "DNI sin puntos", "text"],
  ["fechaNacimiento", "Fecha de nacimiento", "date"],
  ["email", "Correo electrónico", "email"],
  ["telefono", "Teléfono", "tel"],
];
const cantidadPorPagina = 7;

export default function GestionSocios() {
  const { socios, guardarSocio } = usarClub();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [formulario, setFormulario] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [hoy, setHoy] = useState(null);

  useEffect(() => setHoy(new Date()), []);

  const filtrados = socios
    .filter((socio) =>
      `${socio.apellido} ${socio.nombre}`
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim()),
    )
    .sort((a, b) => a.apellido.localeCompare(b.apellido));
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / cantidadPorPagina),
  );
  const visibles = filtrados.slice(
    (pagina - 1) * cantidadPorPagina,
    pagina * cantidadPorPagina,
  );

  function actualizar(evento) {
    setFormulario((actual) => ({
      ...actual,
      [evento.target.name]: evento.target.value,
    }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    const resultado = await guardarSocio(formulario);
    setAviso({
      ok: resultado.ok,
      texto: resultado.ok ? "Socio guardado." : resultado.error,
    });
    if (resultado.ok) setFormulario(null);
  }

  return (
    <>
      <header className={estilos.cabecera}>
        <div>
          <span className="sobretitulo">Secretaría</span>
          <h1 className="titulo-pagina">Gestión de socios</h1>
          <p className="descripcion-pagina">
            Consultá el padrón, buscá por apellido y administrá los datos.
          </p>
        </div>
        <button
          className="boton boton--principal"
          onClick={() => {
            setFormulario({ ...inicial });
            setAviso(null);
          }}
        >
          Nuevo socio
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
            <h2>{formulario.id ? "Editar socio" : "Nuevo socio"}</h2>
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
                maxLength={nombre === "dni" ? 8 : undefined}
              />
            ))}
            <Campo
              nombre="estadoCuota"
              etiqueta="Estado de cuota"
              valor={formulario.estadoCuota}
              alCambiar={actualizar}
              opciones={[
                ["AL_DIA", "Al día"],
                ["MOROSO", "Moroso"],
              ]}
            />
          </div>
          <div className="formulario-acciones">
            <button type="submit" className="boton boton--principal">
              Guardar socio
            </button>
          </div>
        </form>
      )}

      <section className={`panel ${estilos.tablaPanel}`}>
        <div className={estilos.herramientas}>
          <strong>{filtrados.length} socios encontrados</strong>
          <div className="campo">
            <label htmlFor="busqueda">Buscar por apellido o nombre</label>
            <input
              id="busqueda"
              value={busqueda}
              placeholder="Ej. Pérez"
              onChange={(evento) => {
                setBusqueda(evento.target.value);
                setPagina(1);
              }}
            />
          </div>
        </div>
        <div className="tabla-desborde">
          <table className="tabla">
            <thead>
              <tr>
                <th>Socio</th>
                <th>DNI</th>
                <th>Edad</th>
                <th>Estado de cuota</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((socio) => (
                <tr key={socio.id}>
                  <td>
                    <strong>
                      {socio.apellido}, {socio.nombre}
                    </strong>
                    <div className="texto-muted">{socio.email}</div>
                  </td>
                  <td>{socio.dni}</td>
                  <td>
                    {hoy
                      ? `${calcularEdad(socio.fechaNacimiento, hoy)} años`
                      : "—"}
                  </td>
                  <td>
                    <span
                      className={
                        socio.estadoCuota === "AL_DIA"
                          ? "etiqueta"
                          : "etiqueta etiqueta--error"
                      }
                    >
                      {socio.estadoCuota === "AL_DIA" ? "Al día" : "Moroso"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="boton boton--secundario boton--chico"
                      onClick={() => setFormulario({ ...socio })}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={estilos.paginacion}>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <div>
            <button
              disabled={pagina === 1}
              className="boton boton--secundario boton--chico"
              onClick={() => setPagina(pagina - 1)}
            >
              Anterior
            </button>
            <button
              disabled={pagina === totalPaginas}
              className="boton boton--secundario boton--chico"
              onClick={() => setPagina(pagina + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
