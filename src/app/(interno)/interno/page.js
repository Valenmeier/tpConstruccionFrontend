"use client";
import Link from "next/link";
import { usarClub } from "@/contextos/ContextoClub";
import { dinero } from "@/utilidades/formatos";
import Icono from "@/componentes/Icono/Icono";
import BannerDemo from "@/componentes/BannerDemo/BannerDemo";
import estilos from "./page.module.css";
export default function ResumenInterno() {
  const { actividades, socios, inscripcionesActivas, cupoDisponible } =
    usarClub();
  const morosos = socios.filter(
    (socio) => socio.estadoCuota === "MOROSO",
  ).length;
  const ocupacion = [...actividades]
    .map((actividad) => ({
      ...actividad,
      ocupados: actividad.cupoMaximo - cupoDisponible(actividad),
    }))
    .sort((a, b) => b.ocupados / b.cupoMaximo - a.ocupados / a.cupoMaximo)
    .slice(0, 5);
  return (
    <>
      <header className={estilos.superior}>
        <div>
          <span className="sobretitulo">PANEL DE GESTIÓN</span>
          <h1 className="titulo-pagina">Resumen general</h1>
          <p className="descripcion-pagina">
            Toda la información de Club Los Algarrobos en un solo lugar.
          </p>
        </div>
        <Link href="/interno/inscripciones" className="boton boton--principal">
          <Icono nombre="mas" tamano={17} /> Nueva inscripción
        </Link>
      </header>
      <BannerDemo>
        Acceso sin autenticar: solo prototipo. La autorización de secretaría
        debe implementarse en el backend.
      </BannerDemo>
      <p style={{ marginBlock: "1rem" }}>
        <Link href="/interno/vista-servidor" className="enlace-texto">
          Ver ejemplo de Next Server Component (reemplazo de vistas Thymeleaf)
        </Link>
      </p>
      <div className={estilos.metricas}>
        {[
          ["Socios registrados", socios.length, "usuarios"],
          ["Actividades activas", actividades.length, "actividad"],
          ["Inscripciones activas", inscripcionesActivas.length, "lista"],
          ["Socios morosos", morosos, "moneda"],
        ].map(([titulo, numero, icono]) => (
          <article key={titulo} className={estilos.metrica}>
            <div className={estilos.metricaCabecera}>
              <span>{titulo}</span>
              <Icono nombre={icono} tamano={20} />
            </div>
            <strong>{numero}</strong>
            <small>Datos de demostración</small>
          </article>
        ))}
      </div>
      <div className={estilos.columnas}>
        <section className="panel">
          <div className={estilos.panelEncabezado}>
            <h2>Ocupación por actividad</h2>
            <Link className="enlace-texto" href="/interno/actividades">
              Gestionar <Icono nombre="flecha" tamano={16} />
            </Link>
          </div>
          <div className={estilos.ocupaciones}>
            {ocupacion.map((actividad) => (
              <div key={actividad.id} className={estilos.ocupacion}>
                <div>
                  <strong>{actividad.nombre}</strong>
                  <span>
                    {actividad.ocupados} de {actividad.cupoMaximo} inscriptos
                  </span>
                </div>
                <div className={estilos.progreso}>
                  <span
                    style={{
                      width: `${(actividad.ocupados / actividad.cupoMaximo) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={`panel ${estilos.accesos}`}>
          <div className={estilos.panelEncabezado}>
            <h2>Accesos rápidos</h2>
          </div>
          <Link href="/interno/socios">
            <div>
              <Icono nombre="usuarios" />
              <span>
                <strong>Gestionar socios</strong>
                <small>Altas, edición y búsqueda</small>
              </span>
            </div>
            <Icono nombre="flecha" tamano={16} />
          </Link>
          <Link href="/interno/actividades">
            <div>
              <Icono nombre="actividad" />
              <span>
                <strong>Gestionar actividades</strong>
                <small>Cupos, horarios y cuotas</small>
              </span>
            </div>
            <Icono nombre="flecha" tamano={16} />
          </Link>
          <Link href="/interno/inscripciones">
            <div>
              <Icono nombre="lista" />
              <span>
                <strong>Inscripciones</strong>
                <small>Altas y bajas de actividades</small>
              </span>
            </div>
            <Icono nombre="flecha" tamano={16} />
          </Link>
          <div className={estilos.recaudacion}>
            Ejemplo de cuota: Yoga — {dinero(17000)} al mes
          </div>
        </section>
      </div>
    </>
  );
}
