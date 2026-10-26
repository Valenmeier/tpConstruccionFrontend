"use client";
import Link from "next/link";
import Icono from "@/componentes/Icono/Icono";
import TarjetaActividad from "@/componentes/TarjetaActividad/TarjetaActividad";
import BannerDemo from "@/componentes/BannerDemo/BannerDemo";
import { usarClub } from "@/contextos/ContextoClub";
import { calcularCuotaMensual, dinero } from "@/utilidades/formatos";
import estilos from "./page.module.css";
export default function InicioSocios() {
  const { socioActual, actividades, actividadesDeSocio } = usarClub();
  const actuales = socioActual ? actividadesDeSocio(socioActual.id) : [];
  const resumen = calcularCuotaMensual(actuales.map((item) => item.actividad));
  return (
    <div className="contenedor pagina">
      <BannerDemo>
        Ingreso simulado. Próximamente Spring Boot verificará la identidad y los
        permisos.
      </BannerDemo>
      {socioActual ? (
        <>
          <section className={estilos.saludo}>
            <div>
              <span className="sobretitulo">TU ESPACIO PERSONAL</span>
              <h1>¡Hola, {socioActual.nombre}!</h1>
              <p>
                Qué bueno tenerte por acá. Así está tu actividad en el club.
              </p>
            </div>
            <Link className="boton boton--acento" href="/socios/actividades">
              Explorar actividades <Icono nombre="flecha" tamano={17} />
            </Link>
          </section>
          <section className={estilos.estadisticas}>
            <article>
              <Icono nombre="actividad" tamano={22} />
              <div>
                <strong>{actuales.length}</strong>
                <span>Actividades activas</span>
              </div>
            </article>
            <article>
              <Icono nombre="moneda" tamano={22} />
              <div>
                <strong>{dinero(resumen.total)}</strong>
                <span>Cuota mensual estimada</span>
              </div>
            </article>
            <article>
              <Icono nombre="escudo" tamano={22} />
              <div>
                <strong>
                  {socioActual.estadoCuota === "AL_DIA" ? "Al día" : "Moroso"}
                </strong>
                <span>Estado de cuota</span>
              </div>
            </article>
          </section>
          <div className={estilos.bloque}>
            <div>
              <h2>Mis actividades</h2>
              <p>Todo lo que estás compartiendo en el club.</p>
            </div>
            <Link href="/socios/mis-actividades" className="enlace-texto">
              Ver mis inscripciones <Icono nombre="flecha" tamano={16} />
            </Link>
          </div>
          {actuales.length ? (
            <div className={estilos.actuales}>
              {actuales.map(({ id, actividad }) => (
                <div className={estilos.actual} key={id}>
                  <span className={estilos.emoji}>
                    <Icono nombre="actividad" tamano={24} />
                  </span>
                  <div>
                    <strong>{actividad.nombre}</strong>
                    <small>
                      {actividad.dias} · {actividad.horario} hs
                    </small>
                  </div>
                  <span className="etiqueta">Activa</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={estilos.vacio}>
              <p>¡Todavía no estás inscripto en ninguna actividad!</p>
              <Link
                href="/socios/actividades"
                className="boton boton--principal"
              >
                Elegir una actividad
              </Link>
            </div>
          )}
        </>
      ) : (
        <section className={estilos.sinSesion}>
          <Icono nombre="usuarios" tamano={52} />
          <span className="sobretitulo">BIENVENIDO A MI CLUB</span>
          <h1>Tu club, en un solo lugar.</h1>
          <p>
            Ingresá con tu cuenta de socio para ver tus inscripciones, la cuota
            mensual y anotarte en nuevas actividades.
          </p>
          <div className={estilos.acciones}>
            <Link href="/ingreso" className="boton boton--principal">
              Ingresar a Mi Club <Icono nombre="flecha" tamano={17} />
            </Link>
            <Link href="/preinscripcion" className="boton boton--secundario">
              Todavía no soy socio
            </Link>
          </div>
        </section>
      )}
      <div className={estilos.bloque}>
        <div>
          <span className="sobretitulo">DESCUBRÍ ALGO NUEVO</span>
          <h2>Actividades para vos</h2>
        </div>
        <Link href="/socios/actividades" className="enlace-texto">
          Ver todas <Icono nombre="flecha" tamano={16} />
        </Link>
      </div>
      <div className="grilla-tarjetas">
        {actividades.slice(3, 6).map((actividad) => (
          <TarjetaActividad
            key={actividad.id}
            actividad={actividad}
            sector="socios"
          />
        ))}
      </div>
    </div>
  );
}
