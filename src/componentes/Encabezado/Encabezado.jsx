"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Marca from "@/componentes/Marca/Marca";
import Icono from "@/componentes/Icono/Icono";
import { usarClub } from "@/contextos/ContextoClub";
import estilos from "./Encabezado.module.css";

function EnlacePrincipal({ titulo, url, cerrarMenu }) {
  const ruta = usePathname();
  const activo =
    url === "/" || url === "/socios"
      ? ruta === url
      : !url.includes("#") && ruta.startsWith(url);

  return (
    <Link
      href={url}
      onClick={cerrarMenu}
      className={`${estilos.enlace} ${activo ? estilos.activo : ""}`}
      aria-current={activo ? "page" : undefined}
    >
      {titulo}
    </Link>
  );
}

export default function Encabezado({ sector = "publico" }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { socioActual } = usarClub();
  const esSocio = sector === "socios";
  const enlaces = esSocio
    ? [
        { titulo: "Mi espacio", url: "/socios" },
        { titulo: "Actividades", url: "/socios/actividades" },
        { titulo: "Mis actividades", url: "/socios/mis-actividades" },
      ]
    : [
        { titulo: "Inicio", url: "/" },
        { titulo: "Actividades", url: "/actividades" },
        { titulo: "El club", url: "/#nosotros" },
        { titulo: "Asociate", url: "/preinscripcion" },
      ];

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.contenido}`}>
        <Marca href={esSocio ? "/socios" : "/"} />
        <button
          className={estilos.hamburguesa}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <Icono nombre={menuAbierto ? "cerrar" : "menu"} tamano={25} />
        </button>

        <nav
          className={`${estilos.navegacion} ${menuAbierto ? estilos.abierta : ""}`}
          id="menu-principal"
          aria-label="Navegación principal"
        >
          {enlaces.map(({ titulo, url }) => (
            <Suspense
              key={url}
              fallback={
                <Link
                  href={url}
                  onClick={cerrarMenu}
                  className={estilos.enlace}
                >
                  {titulo}
                </Link>
              }
            >
              <EnlacePrincipal
                titulo={titulo}
                url={url}
                cerrarMenu={cerrarMenu}
              />
            </Suspense>
          ))}

          {esSocio ? (
            <Link
              onClick={cerrarMenu}
              href="/ingreso"
              className={`boton boton--secundario ${estilos.llamada}`}
            >
              <Icono nombre="usuario" tamano={17} />
              {socioActual ? socioActual.nombre : "Ingresar"}
            </Link>
          ) : (
            <Link
              onClick={cerrarMenu}
              href="/ingreso"
              className={`boton boton--principal ${estilos.llamada}`}
            >
              Ingresar <Icono nombre="flecha" tamano={16} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
