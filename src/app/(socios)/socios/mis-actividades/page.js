"use client";
import Link from "next/link";
import Icono from "@/componentes/Icono/Icono";
import { usarClub } from "@/contextos/ContextoClub";
import { calcularCuotaMensual, dinero } from "@/utilidades/formatos";
import estilos from "./page.module.css";
export default function MisActividades() {
  const { socioActual, actividadesDeSocio, darDeBaja } = usarClub();
  if (!socioActual)
    return (
      <div className="contenedor pagina">
        <h1 className="titulo-pagina">Tus actividades</h1>
        <div className="mensaje mensaje--info">
          Ingresá como socio para consultar tus inscripciones.
        </div>
        <div style={{ marginTop: 20 }}>
          <Link className="boton boton--principal" href="/ingreso">
            Ir al ingreso
          </Link>
        </div>
      </div>
    );
  const inscripciones = actividadesDeSocio(socioActual.id);
  const cuota = calcularCuotaMensual(
    inscripciones.map((item) => item.actividad),
  );
  return (
    <div className="contenedor pagina">
      <header className="encabezado-seccion">
        <span className="sobretitulo">MI ESPACIO PERSONAL</span>
        <h1 className="titulo-pagina">Mis actividades</h1>
        <p className="descripcion-pagina">
          Consultá tus inscripciones y llevá el control de tu cuota mensual.
        </p>
      </header>
      <div className={estilos.disposicion}>
        <section>
          <div className={estilos.cabecera}>
            <h2>
              Inscripciones activas{" "}
              <span className="etiqueta">{inscripciones.length}/3</span>
            </h2>
            <Link
              href="/socios/actividades"
              className="boton boton--secundario boton--chico"
            >
              + Explorar
            </Link>
          </div>
          {inscripciones.length ? (
            <div className={estilos.lista}>
              {inscripciones.map(({ id, actividad }) => (
                <article key={id} className={estilos.fila}>
                  <div className={estilos.emoji}>
                    <Icono nombre="actividad" tamano={24} />
                  </div>
                  <div className={estilos.info}>
                    <strong>{actividad.nombre}</strong>
                    <small>
                      {actividad.dias} · {actividad.horario} hs
                    </small>
                    <span>{dinero(actividad.cuotaMensual)} al mes</span>
                  </div>
                  <button
                    type="button"
                    className={estilos.baja}
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `¿Dar de baja la inscripción a ${actividad.nombre}?`,
                        )
                      )
                        return;
                      const resultado = await darDeBaja(id);
                      if (resultado?.ok === false)
                        window.alert(resultado.error);
                    }}
                  >
                    Darme de baja
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className={estilos.vacio}>
              <Icono nombre="actividad" tamano={42} />
              <h3>Todavía no tenés actividades</h3>
              <p>Descubrí todo lo que podés hacer en el club.</p>
              <Link
                href="/socios/actividades"
                className="boton boton--principal"
              >
                Explorar actividades
              </Link>
            </div>
          )}
        </section>
        <aside className={estilos.resumen}>
          <span className="sobretitulo">RESUMEN DE CUOTA</span>
          <h2>Tu cuota mensual</h2>
          <div className={estilos.numero}>{dinero(cuota.total)}</div>
          <div className={estilos.renglon}>
            <span>Subtotal</span>
            <strong>{dinero(cuota.subtotal)}</strong>
          </div>
          <div className={estilos.renglon}>
            <span>Descuento por actividades</span>
            <strong>{cuota.descuento * 100}%</strong>
          </div>
          <div className={estilos.renglon}>
            <span>Estado de cuota</span>
            <strong>
              {socioActual.estadoCuota === "AL_DIA" ? "Al día" : "Moroso"}
            </strong>
          </div>
          <div className="mensaje mensaje--info">
            Con 2 actividades tenés 10 % de descuento y con 3 actividades, 15 %.
          </div>
          <small>Importe estimado, sin integración de pagos.</small>
        </aside>
      </div>
    </div>
  );
}
