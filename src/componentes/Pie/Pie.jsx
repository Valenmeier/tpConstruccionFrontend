import Link from "next/link";
import Marca from "@/componentes/Marca/Marca";
import Icono from "@/componentes/Icono/Icono";
import AnioActual from "@/componentes/AnioActual/AnioActual";
import estilos from "./Pie.module.css";
export default function Pie({ compacto = false }) {
  return (
    <footer className={estilos.pie}>
      <div className={`contenedor ${estilos.interior}`}>
        <div className={estilos.info}>
          <Marca claro />
          <p>
            Un espacio para encontrarnos, hacer deporte y crecer juntos en
            Córdoba.
          </p>
        </div>
        {!compacto && (
          <>
            <div className={estilos.columna}>
              <strong>Explorá</strong>
              <Link href="/">Inicio</Link>
              <Link href="/actividades">Actividades</Link>
              <Link href="/preinscripcion">Asociate al club</Link>
            </div>
            <div className={estilos.columna}>
              <strong>Tu espacio</strong>
              <Link href="/ingreso">Ingresar</Link>
              <Link href="/socios">Mi Club</Link>
              <Link href="/interno">Secretaría (demo)</Link>
            </div>
          </>
        )}
        <div className={estilos.columna}>
          <strong>Encontranos</strong>
          <span className={estilos.ubicacion}>
            <Icono nombre="ubicacion" tamano={16} /> Córdoba, Argentina
          </span>
          <span>¡Te esperamos en el club!</span>
        </div>
      </div>
      <div className={`contenedor ${estilos.inferior}`}>
        <span>
          © <AnioActual /> Club Los Algarrobos
        </span>
        <span>
          Sitio de demostración académica ·{" "}
          <Link href="/creditos">Créditos de imágenes</Link>
        </span>
      </div>
    </footer>
  );
}
