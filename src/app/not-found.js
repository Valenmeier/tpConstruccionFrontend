import Link from "next/link";
export default function NoEncontrada() {
  return (
    <main className="contenedor pagina">
      <p className="sobretitulo">ERROR 404</p>
      <h1 className="titulo-pagina">No encontramos esta página.</h1>
      <p className="descripcion-pagina">
        Probá volver al inicio del Club Los Algarrobos.
      </p>
      <div style={{ marginTop: 24 }}>
        <Link href="/" className="boton boton--principal">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
