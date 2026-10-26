import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { listarActividadesParaServidor } from "@/servidor/consultasServidor";
import { dinero } from "@/utilidades/formatos";

// Equivalente arquitectónico a una plantilla de Thymeleaf que muestra datos.
export const metadata = { title: "Vista de servidor" };

export default function VistaServidor() {
  return (
    <Suspense
      fallback={
        <main className="contenedor pagina">
          <p>Cargando actividades...</p>
        </main>
      }
    >
      <ContenidoVistaServidor />
    </Suspense>
  );
}

async function ContenidoVistaServidor() {
  // La consulta a MySQL o Spring se hace durante la petición, no durante el build.
  await connection();
  let actividades = [],
    error = "";
  try {
    actividades = await listarActividadesParaServidor();
  } catch (e) {
    error = "No se pudieron obtener las actividades. Revisá la API y MySQL.";
    console.error(e);
  }

  return (
    <main className="contenedor pagina">
      <span className="sobretitulo">Demostración técnica</span>
      <h1 className="titulo-pagina">Vista renderizada en el servidor</h1>
      <p className="descripcion-pagina">
        Esta tabla se genera en un Server Component de Next.js, sin useState ni
        useEffect. Es un ejemplo para comparar el renderizado en servidor con
        Thymeleaf.
      </p>
      {error && (
        <p role="alert" className="mensaje mensaje--error">
          {error}
        </p>
      )}
      <section
        className="panel"
        style={{ marginTop: "1.5rem", padding: "1rem" }}
      >
        <div className="tabla-desborde">
          <table className="tabla">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Disciplina</th>
                <th>Horario</th>
                <th>Cupo</th>
                <th>Cuota</th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((a) => (
                <tr key={a.id}>
                  <td>{a.nombre}</td>
                  <td>{a.disciplina}</td>
                  <td>
                    {a.dias}, {a.horario}
                  </td>
                  <td>
                    {a.cupoDisponible}/{a.cupoMaximo}
                  </td>
                  <td>{dinero(a.cuotaMensual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/interno" className="enlace-texto">
          Volver al panel
        </Link>
      </p>
    </main>
  );
}
