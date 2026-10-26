"use client";

import Link from "next/link";
import Icono from "@/componentes/Icono/Icono";
import ImagenActividad from "@/componentes/ImagenActividad/ImagenActividad";
import TarjetaActividad from "@/componentes/TarjetaActividad/TarjetaActividad";
import { usarClub } from "@/contextos/ContextoClub";
import estilos from "./page.module.css";

export default function Inicio() {
  const { actividades, datosCargados, errorCarga } = usarClub();
  const destacada = actividades[0];

  return (
    <>
      <section className={estilos.hero}>
        <div className={`contenedor ${estilos.heroInterior}`}>
          <div>
            <span className="sobretitulo">Club Los Algarrobos · Córdoba</span>
            <h1>
              Donde el deporte se convierte en <em>comunidad.</em>
            </h1>
            <p>
              Un lugar para aprender, compartir y disfrutar. Mirá las
              actividades, horarios y precios sin registrarte.
            </p>
            <div className={estilos.acciones}>
              <Link href="/actividades" className="boton boton--acento">
                Explorar actividades <Icono nombre="flecha" />
              </Link>
              <Link href="/preinscripcion" className={estilos.enlaceClaro}>
                Quiero asociarme
              </Link>
            </div>
            <div className={estilos.numeros}>
              <span>
                <strong>8</strong> actividades
              </span>
              <span>
                <strong>650+</strong> socios
              </span>
              <span>
                <strong>1</strong> comunidad
              </span>
            </div>
          </div>
          {destacada && <ImagenActividad actividad={destacada} grande />}
        </div>
      </section>

      <section className={estilos.beneficios}>
        <div className="contenedor grilla-tarjetas">
          {[
            [
              "corazon",
              "Una comunidad cercana",
              "Compartimos mucho más que entrenamientos.",
            ],
            [
              "usuarios",
              "Para todas las edades",
              "Actividades para chicos, jóvenes y adultos.",
            ],
            [
              "escudo",
              "Profes que acompañan",
              "Aprendé junto a nuestro equipo.",
            ],
          ].map(([icono, titulo, texto]) => (
            <article key={titulo}>
              <Icono nombre={icono} tamano={28} />
              <div>
                <h3>{titulo}</h3>
                <p className="texto-muted">{texto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contenedor seccion-espaciada">
        <div className={estilos.titulos}>
          <div>
            <span className="sobretitulo">Actividades</span>
            <h2>Hay un lugar para vos</h2>
            <p className="texto-muted">
              Consultá los detalles de cada actividad sin iniciar sesión.
            </p>
          </div>
          <Link href="/actividades" className="enlace-texto">
            Ver todas <Icono nombre="flecha" />
          </Link>
        </div>
        {!datosCargados && <p role="status">Cargando actividades...</p>}
        {datosCargados && errorCarga && (
          <p role="alert">No pudimos cargar las actividades: {errorCarga}</p>
        )}
        {datosCargados && !errorCarga && actividades.length === 0 && (
          <p>Aún no hay actividades publicadas.</p>
        )}
        <div className="grilla-tarjetas">
          {actividades.slice(0, 3).map((actividad) => (
            <TarjetaActividad key={actividad.id} actividad={actividad} />
          ))}
        </div>
      </section>

      <section className={`contenedor ${estilos.nosotros}`} id="nosotros">
        <div className={estilos.marcaClub} aria-hidden="true">
          LA
        </div>
        <div>
          <span className="sobretitulo">Nuestro club</span>
          <h2>Las mejores historias se juegan en equipo.</h2>
          <p>
            Somos un club social y deportivo de Córdoba. Compartimos
            actividades, aprendemos nuevas habilidades y construimos vínculos
            entre vecinos.
          </p>
          <Link href="/preinscripcion" className="boton boton--principal">
            Formá parte del club
          </Link>
        </div>
      </section>

      <section className={estilos.cierre}>
        <div className="contenedor">
          <div>
            <h2>Tu próxima actividad empieza acá.</h2>
            <p>Primero asociate. Después elegís tus actividades.</p>
          </div>
          <Link href="/preinscripcion" className="boton boton--acento">
            Quiero asociarme
          </Link>
        </div>
      </section>
    </>
  );
}
