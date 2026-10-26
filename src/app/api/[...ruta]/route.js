import { NextResponse, connection } from "next/server";
import { atenderApiTemporal, normalizarError } from "@/servidor/apiTemporal";

async function atender(request, contexto) {
  const { ruta } = await contexto.params;
  if (process.env.MODO_API === "spring") {
    const base = process.env.SPRING_API_URL;
    if (!base)
      return NextResponse.json(
        { error: "Falta SPRING_API_URL." },
        { status: 500 },
      );
    const destino = new URL(
      `${base.replace(/\/$/, "")}/api/${ruta.map(encodeURIComponent).join("/")}${new URL(request.url).search}`,
    );
    try {
      const respuesta = await fetch(destino, {
        method: request.method,
        headers: {
          "Content-Type":
            request.headers.get("content-type") || "application/json",
        },
        ...(request.method === "GET" || request.method === "HEAD"
          ? {}
          : { body: await request.text() }),
        cache: "no-store",
      });
      if (respuesta.status === 204) return new Response(null, { status: 204 });
      return new Response(await respuesta.text(), {
        status: respuesta.status,
        headers: {
          "Content-Type":
            respuesta.headers.get("content-type") || "application/json",
        },
      });
    } catch (e) {
      console.error("Spring no disponible:", e);
      return NextResponse.json(
        { error: "No se pudo conectar con Spring Boot." },
        { status: 502 },
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "La API temporal está deshabilitada en producción. Configurá MODO_API=spring.",
      },
      { status: 403 },
    );
  }
  try {
    const { cuerpo, estado } = await atenderApiTemporal(request, ruta);
    return estado === 204
      ? new Response(null, { status: 204 })
      : NextResponse.json(cuerpo, { status: estado });
  } catch (e) {
    const { cuerpo, estado } = normalizarError(e);
    return NextResponse.json(cuerpo, { status: estado });
  }
}
export async function GET(request, contexto) {
  await connection();
  return atender(request, contexto);
}
export const POST = atender;
export const PUT = atender;
export const DELETE = atender;
