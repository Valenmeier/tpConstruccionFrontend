"use client";
import { usarClub } from "@/contextos/ContextoClub";
export default function AvisoConexion() {
  const { errorCarga } = usarClub();
  return errorCarga ? (
    <div
      role="alert"
      className="mensaje mensaje--error"
      style={{ padding: "1rem", textAlign: "center" }}
    >
      No se pudieron cargar los datos de la API: {errorCarga}. Revisá MySQL y
      .env.local.
    </div>
  ) : null;
}
