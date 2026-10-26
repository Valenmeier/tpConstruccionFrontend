"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Marca from "@/componentes/Marca/Marca";
import Icono from "@/componentes/Icono/Icono";
import { usarClub } from "@/contextos/ContextoClub";
import estilos from "./page.module.css";
export default function Ingreso() {
  const [sector, setSector] = useState("socio");
  const [dni, setDni] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [aviso, setAviso] = useState("");
  const { socios, setSocioActualId } = usarClub();
  const router = useRouter();
  function ingresar(evento) {
    evento.preventDefault();
    setAviso(
      "El acceso real con credenciales se habilitará al conectar Spring Boot. Podés explorar el modo demostración desde el botón inferior.",
    );
  }
  function probarDemo() {
    setAviso("");
    if (sector === "personal") return router.push("/interno");
    const socio = socios.find((item) => item.dni === "40123456") || socios[0];
    if (socio) {
      setSocioActualId(socio.id);
      router.push("/socios");
    }
  }
  return (
    <div className={estilos.fondo}>
      <div className={estilos.tarjeta}>
        <div className={estilos.marca}>
          <Marca />
        </div>
        <h1>¡Qué bueno verte!</h1>
        <p className={estilos.bajada}>
          Elegí cómo querés ingresar al Club Los Algarrobos.
        </p>
        <div
          className={estilos.opciones}
          role="group"
          aria-label="Tipo de acceso"
        >
          <button
            type="button"
            className={sector === "socio" ? estilos.seleccionado : ""}
            onClick={() => {
              setSector("socio");
              setAviso("");
            }}
          >
            <Icono nombre="usuario" tamano={18} /> Socios
          </button>
          <button
            type="button"
            className={sector === "personal" ? estilos.seleccionado : ""}
            onClick={() => {
              setSector("personal");
              setAviso("");
            }}
          >
            <Icono nombre="escudo" tamano={18} /> Secretaría
          </button>
        </div>
        <form onSubmit={ingresar} className={estilos.formulario}>
          <div className="campo">
            <label htmlFor="identificador">
              {sector === "socio" ? "DNI" : "Usuario"}
            </label>
            <input
              id="identificador"
              autoComplete="username"
              required
              value={dni}
              placeholder={
                sector === "socio"
                  ? "Tu DNI sin puntos"
                  : "Usuario de secretaría"
              }
              onChange={(evento) => setDni(evento.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              required
              value={contrasena}
              placeholder="Ingresá tu contraseña"
              onChange={(evento) => setContrasena(evento.target.value)}
            />
          </div>
          {aviso && (
            <p className="mensaje mensaje--info" role="status">
              {aviso}
            </p>
          )}
          <button type="submit" className="boton boton--principal boton--ancho">
            Ingresar <Icono nombre="flecha" tamano={17} />
          </button>
        </form>
        <div className={estilos.demostracion}>
          <p>
            <strong>¿Querés probar el prototipo?</strong>
            <br />
            La autenticación todavía no está conectada al backend.
          </p>
          <button
            className="boton boton--secundario boton--ancho"
            type="button"
            onClick={probarDemo}
          >
            {sector === "personal"
              ? "Explorar secretaría (demo)"
              : "Explorar Mi Club (demo)"}
          </button>
        </div>
        <p className={estilos.registro}>
          {sector === "socio" ? (
            <>
              ¿Todavía no sos socio?{" "}
              <Link href="/preinscripcion">Asociate acá</Link>
            </>
          ) : (
            <>
              ¿Querés conocer el club? <Link href="/">Volver al sitio</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
