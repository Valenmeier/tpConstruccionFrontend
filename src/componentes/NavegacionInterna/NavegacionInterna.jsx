"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Marca from "@/componentes/Marca/Marca";
import Icono from "@/componentes/Icono/Icono";
import estilos from "./NavegacionInterna.module.css";

const enlaces = [
  { href: "/interno", texto: "Resumen general", icono: "tablero" },
  { href: "/interno/actividades", texto: "Actividades", icono: "actividad" },
  { href: "/interno/socios", texto: "Socios", icono: "usuarios" },
  { href: "/interno/inscripciones", texto: "Inscripciones", icono: "lista" },
];

// Se aísla el hook para preservar el resto del menú durante el prerenderizado.
function EnlaceInterno({ item, cerrarMenu }) {
  const ruta = usePathname();
  const activo =
    item.href === "/interno" ? ruta === item.href : ruta.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={cerrarMenu}
      className={`${estilos.enlace} ${activo ? estilos.activo : ""}`}
      aria-current={activo ? "page" : undefined}
    >
      <Icono nombre={item.icono} tamano={19} />
      {item.texto}
    </Link>
  );
}

export default function NavegacionInterna({ children }) {
  const [abierto, setAbierto] = useState(false);
  const cerrarMenu = () => setAbierto(false);

  return (
    <div className={estilos.disposicion}>
      <aside
        className={`${estilos.lateral} ${abierto ? estilos.lateralAbierto : ""}`}
      >
        <div className={estilos.logotipo}>
          <Marca claro href="/interno" />
        </div>
        <div className={estilos.identificador}>PANEL DE SECRETARÍA</div>
        <nav aria-label="Navegación de secretaría" className={estilos.menu}>
          {enlaces.map((item) => (
            <Suspense
              key={item.href}
              fallback={
                <Link
                  href={item.href}
                  onClick={cerrarMenu}
                  className={estilos.enlace}
                >
                  <Icono nombre={item.icono} tamano={19} />
                  {item.texto}
                </Link>
              }
            >
              <EnlaceInterno item={item} cerrarMenu={cerrarMenu} />
            </Suspense>
          ))}
        </nav>
        <div className={estilos.lateralPie}>
          <Link href="/">
            <Icono nombre="volver" tamano={17} />
            Volver al sitio
          </Link>
          <small>Club Los Algarrobos · Demo</small>
        </div>
      </aside>

      {abierto && (
        <button
          aria-label="Cerrar menú lateral"
          className={estilos.velo}
          onClick={cerrarMenu}
        />
      )}

      <div className={estilos.area}>
        <header className={estilos.barra}>
          <div className={estilos.barraIzquierda}>
            <button
              className={estilos.activador}
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú de secretaría"
            >
              <Icono nombre="menu" />
            </button>
            <div>
              <strong>Secretaría</strong>
              <span>Gestión del club</span>
            </div>
          </div>
          <div className={estilos.usuario}>
            <span className={estilos.avatar}>M</span>
            <span>
              Personal del club <small>Acceso demo</small>
            </span>
          </div>
        </header>
        <main className={estilos.contenido}>{children}</main>
        <footer className={estilos.pieInterno}>
          © Club Los Algarrobos · Panel interno de demostración
        </footer>
      </div>
    </div>
  );
}
