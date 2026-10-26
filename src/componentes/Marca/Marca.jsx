import Link from "next/link";
import estilos from "./Marca.module.css";

export default function Marca({ claro = false, compacto = false, href = "/" }) {
  return (
    <Link
      href={href}
      className={`${estilos.marca} ${claro ? estilos.claro : ""}`}
      aria-label="Club Los Algarrobos, ir al inicio"
    >
      <span className={estilos.emblema} aria-hidden="true">
        <span>LA</span>
      </span>
      {!compacto && (
        <span className={estilos.nombre}>
          <strong>LOS ALGARROBOS</strong>
          <small>CLUB SOCIAL Y DEPORTIVO</small>
        </span>
      )}
    </Link>
  );
}
