"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Campo from "@/componentes/Campo/Campo";
import { usarClub } from "@/contextos/ContextoClub";
import { esDniValido } from "@/utilidades/formatos";
import estilos from "./FormularioRegistro.module.css";

const campos = [
  ["nombre", "Nombre", "text"],
  ["apellido", "Apellido", "text"],
  ["dni", "DNI sin puntos", "text"],
  ["fechaNacimiento", "Fecha de nacimiento", "date"],
  ["email", "Correo electrónico", "email"],
  ["telefono", "Teléfono", "tel"],
  ["contrasena", "Contraseña", "password"],
  ["confirmarContrasena", "Confirmar contraseña", "password"],
];
const inicial = Object.fromEntries(campos.map(([nombre]) => [nombre, ""]));

export default function FormularioRegistro() {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState("");
  const { registrarSocio } = usarClub();
  const router = useRouter();

  function actualizar(evento) {
    const { name, value } = evento.target;
    setDatos((actual) => ({ ...actual, [name]: value }));
    setErrores((actual) => ({ ...actual, [name]: "" }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setAviso("");
    const nuevosErrores = {};

    // HTML valida el formato del correo; RN7 valida el DNI.
    for (const [nombre] of campos) {
      if (!datos[nombre].trim()) nuevosErrores[nombre] = "Completá este campo.";
    }
    if (!esDniValido(datos.dni))
      nuevosErrores.dni = "El DNI debe tener 7 u 8 números sin puntos.";
    if (!evento.currentTarget.elements.email.validity.valid)
      nuevosErrores.email = "Ingresá un correo válido.";
    if (datos.fechaNacimiento > new Date().toISOString().slice(0, 10))
      nuevosErrores.fechaNacimiento = "La fecha no puede ser futura.";
    if (datos.contrasena.length < 8)
      nuevosErrores.contrasena = "Usá al menos 8 caracteres.";
    if (datos.contrasena !== datos.confirmarContrasena)
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length) return;

    // La contraseña se solicita solo para mostrar el futuro formulario.
    // Nunca se guarda en localStorage ni se envía en esta demostración.
    const { nombre, apellido, dni, fechaNacimiento, email, telefono } = datos;
    const resultado = await registrarSocio({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      email,
      telefono,
    });
    if (!resultado.ok) return setAviso(resultado.error);

    const actividad = new URLSearchParams(window.location.search).get(
      "actividad",
    );
    const ruta =
      actividad && Number.isInteger(Number(actividad)) && Number(actividad) > 0
        ? `/socios/actividades/${actividad}`
        : "/socios";
    router.push(ruta);
  }

  return (
    <form onSubmit={enviar} noValidate className={estilos.formulario}>
      <div className="formulario-grilla">
        {campos.map(([nombre, etiqueta, tipo]) => (
          <Campo
            key={nombre}
            nombre={nombre}
            etiqueta={etiqueta}
            tipo={tipo}
            valor={datos[nombre]}
            alCambiar={actualizar}
            error={errores[nombre]}
            maxLength={nombre === "dni" ? 8 : undefined}
            required
          />
        ))}
      </div>
      <p className="mensaje mensaje--info">
        Registro de prueba. Si la API está habilitada, se guarda en MySQL. La
        contraseña todavía no se registra ni autentica.
      </p>
      {aviso && (
        <p className="mensaje mensaje--error" role="alert">
          {aviso}
        </p>
      )}
      <div className={estilos.final}>
        <button className="boton boton--principal" type="submit">
          Crear cuenta
        </button>
        <span>
          ¿Ya sos socio? <Link href="/ingreso">Ir al ingreso</Link>
        </span>
      </div>
    </form>
  );
}
