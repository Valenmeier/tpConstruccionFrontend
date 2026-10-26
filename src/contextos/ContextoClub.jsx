"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  actividadesIniciales,
  inscripcionesIniciales,
  sociosIniciales,
} from "@/datos/datosIniciales";
import { calcularEdad, esDniValido } from "@/utilidades/formatos";
import { apiClub } from "@/servicios/apiClub";

const USAR_API = process.env.NEXT_PUBLIC_USAR_API === "true";

const ContextoClub = createContext(null);
const CLAVE_DATOS = "socioclub-demo-datos-v1";
const CLAVE_SESION = "socioclub-demo-sesion-v1";

function siguienteId(elementos) {
  return (
    elementos.reduce((mayor, elemento) => Math.max(mayor, elemento.id), 0) + 1
  );
}

export function ProveedorClub({ children }) {
  const [actividades, setActividades] = useState(
    USAR_API ? [] : actividadesIniciales,
  );
  const [socios, setSocios] = useState(USAR_API ? [] : sociosIniciales);
  const [inscripciones, setInscripciones] = useState(
    USAR_API ? [] : inscripcionesIniciales,
  );
  const [socioActualId, setSocioActualId] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  async function recargarDatos() {
    const [nuevasActividades, nuevosSocios, nuevasInscripciones] =
      await Promise.all([
        apiClub.listarActividades(),
        apiClub.listarSocios(),
        apiClub.listarInscripciones(),
      ]);
    setActividades(nuevasActividades);
    setSocios(nuevosSocios);
    setInscripciones(nuevasInscripciones);
    setErrorCarga("");
  }

  useEffect(() => {
    if (USAR_API) {
      recargarDatos()
        .catch((error) => setErrorCarga(error.message))
        .finally(() => setDatosCargados(true));
      try {
        const sesionGuardada = localStorage.getItem(CLAVE_SESION);
        if (sesionGuardada) setSocioActualId(Number(sesionGuardada));
      } catch (e) {
        console.warn("No se pudo recuperar el ID de demostración.", e);
      }
      return;
    }
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_DATOS) || "null");
      if (
        guardado &&
        Array.isArray(guardado.actividades) &&
        Array.isArray(guardado.socios) &&
        Array.isArray(guardado.inscripciones)
      ) {
        setActividades(guardado.actividades);
        setSocios(guardado.socios);
        setInscripciones(guardado.inscripciones);
      }
      const sesionGuardada = localStorage.getItem(CLAVE_SESION);
      if (sesionGuardada) setSocioActualId(Number(sesionGuardada));
    } catch (error) {
      console.warn(
        "No se pudieron recuperar los datos de demostración.",
        error,
      );
    }
    setDatosCargados(true);
  }, []);

  useEffect(() => {
    if (!datosCargados || USAR_API) return;
    try {
      localStorage.setItem(
        CLAVE_DATOS,
        JSON.stringify({ actividades, socios, inscripciones }),
      );
    } catch (error) {
      console.warn("No se pudieron guardar los datos de demostración.", error);
    }
  }, [actividades, socios, inscripciones, datosCargados]);

  useEffect(() => {
    if (!datosCargados) return;
    try {
      if (socioActualId !== null)
        localStorage.setItem(CLAVE_SESION, String(socioActualId));
      else localStorage.removeItem(CLAVE_SESION);
    } catch (error) {
      console.warn("No se pudo guardar la sesión de demostración.", error);
    }
  }, [socioActualId, datosCargados]);

  const socioActual =
    socios.find((socio) => socio.id === socioActualId) || null;
  const inscripcionesActivas = inscripciones.filter(
    (item) => item.estado === "ACTIVA",
  );
  const cantidadInscriptos = (actividadId) =>
    inscripcionesActivas.filter(
      (item) => item.actividadId === Number(actividadId),
    ).length;
  const cupoDisponible = (actividad) =>
    Math.max(0, actividad.cupoMaximo - cantidadInscriptos(actividad.id));
  const actividadesDeSocio = (socioId) =>
    inscripcionesActivas
      .filter((item) => item.socioId === Number(socioId))
      .map((item) => ({
        ...item,
        actividad: actividades.find(
          (actividad) => actividad.id === item.actividadId,
        ),
      }))
      .filter((item) => item.actividad);

  async function guardarSocio(datos) {
    if (USAR_API) {
      try {
        const socio = datos.id
          ? await apiClub.actualizarSocio(datos.id, datos)
          : await apiClub.crearSocio(datos);
        await recargarDatos();
        return { ok: true, socio };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    }
    if (!esDniValido(datos.dni))
      return {
        ok: false,
        error: "El DNI debe tener 7 u 8 dígitos sin puntos.",
      };
    if (
      socios.some((socio) => socio.dni === datos.dni && socio.id !== datos.id)
    )
      return { ok: false, error: "Ya hay un socio con ese DNI." };
    if (datos.id) {
      setSocios((anteriores) =>
        anteriores.map((socio) =>
          socio.id === Number(datos.id)
            ? { ...socio, ...datos, id: Number(datos.id) }
            : socio,
        ),
      );
      return { ok: true, socio: { ...datos, id: Number(datos.id) } };
    }
    const socio = {
      ...datos,
      id: siguienteId(socios),
      estadoCuota: datos.estadoCuota || "AL_DIA",
    };
    setSocios((anteriores) => [...anteriores, socio]);
    return { ok: true, socio };
  }

  async function registrarSocio(datos) {
    // La contraseña no se guarda ni se envía: autenticación pendiente para Spring.
    const resultado = await guardarSocio({ ...datos, estadoCuota: "AL_DIA" });
    if (resultado.ok) setSocioActualId(resultado.socio.id);
    return resultado;
  }

  async function guardarActividad(datos) {
    if (USAR_API) {
      try {
        if (datos.id) await apiClub.actualizarActividad(datos.id, datos);
        else await apiClub.crearActividad(datos);
        await recargarDatos();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    }
    const normalizado = {
      ...datos,
      edadMinima: Number(datos.edadMinima),
      edadMaxima: Number(datos.edadMaxima),
      cupoMaximo: Number(datos.cupoMaximo),
      cuotaMensual: Number(datos.cuotaMensual),
    };
    if (normalizado.edadMinima > normalizado.edadMaxima)
      return { ok: false, error: "El rango de edades no es válido." };
    if (normalizado.cupoMaximo < cantidadInscriptos(datos.id || 0))
      return {
        ok: false,
        error: "El cupo no puede ser menor a las inscripciones activas.",
      };
    if (datos.id)
      setActividades((anteriores) =>
        anteriores.map((actividad) =>
          actividad.id === Number(datos.id)
            ? { ...normalizado, id: Number(datos.id) }
            : actividad,
        ),
      );
    else
      setActividades((anteriores) => [
        ...anteriores,
        { ...normalizado, id: siguienteId(anteriores) },
      ]);
    return { ok: true };
  }

  async function eliminarActividad(actividadId) {
    if (USAR_API) {
      try {
        await apiClub.eliminarActividad(actividadId);
        await recargarDatos();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    }
    if (cantidadInscriptos(actividadId) > 0)
      return {
        ok: false,
        error: "No se puede eliminar una actividad con inscriptos activos.",
      };
    setActividades((anteriores) =>
      anteriores.filter((actividad) => actividad.id !== Number(actividadId)),
    );
    return { ok: true };
  }

  async function inscribirSocio(socioId, actividadId) {
    if (USAR_API) {
      try {
        await apiClub.inscribir(socioId, actividadId);
        await recargarDatos();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    }
    const socio = socios.find((item) => item.id === Number(socioId));
    const actividad = actividades.find(
      (item) => item.id === Number(actividadId),
    );
    if (!socio || !actividad)
      return { ok: false, error: "No se encontró el socio o la actividad." };
    if (cupoDisponible(actividad) === 0)
      return {
        ok: false,
        error: "La actividad no tiene cupo disponible. (RN1)",
      };
    if (
      inscripcionesActivas.some(
        (item) =>
          item.socioId === socio.id && item.actividadId === actividad.id,
      )
    )
      return {
        ok: false,
        error: "El socio ya está inscripto en esta actividad. (RN2)",
      };
    const edad = calcularEdad(socio.fechaNacimiento);
    if (edad < actividad.edadMinima || edad > actividad.edadMaxima)
      return {
        ok: false,
        error: `La edad permitida es de ${actividad.edadMinima} a ${actividad.edadMaxima} años. (RN3)`,
      };
    if (socio.estadoCuota === "MOROSO")
      return {
        ok: false,
        error: "Debe regularizar su cuota en secretaría. (RN4)",
      };
    if (actividadesDeSocio(socio.id).length >= 3)
      return { ok: false, error: "Alcanzó el máximo de 3 actividades. (RN5)" };
    setInscripciones((anteriores) => [
      ...anteriores,
      {
        id: siguienteId(anteriores),
        socioId: socio.id,
        actividadId: actividad.id,
        estado: "ACTIVA",
        fechaInscripcion: new Date().toISOString().slice(0, 10),
      },
    ]);
    return { ok: true };
  }

  async function darDeBaja(inscripcionId) {
    if (USAR_API) {
      try {
        await apiClub.darDeBaja(inscripcionId);
        await recargarDatos();
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error.message };
      }
    }
    setInscripciones((anteriores) =>
      anteriores.map((item) =>
        item.id === Number(inscripcionId) ? { ...item, estado: "BAJA" } : item,
      ),
    );
    return { ok: true };
  }

  function reiniciarDemo() {
    if (USAR_API) {
      return recargarDatos();
    } // No borra la base real.
    setActividades(actividadesIniciales);
    setSocios(sociosIniciales);
    setInscripciones(inscripcionesIniciales);
    setSocioActualId(null);
  }

  return (
    <ContextoClub.Provider
      value={{
        actividades,
        socios,
        inscripciones,
        inscripcionesActivas,
        socioActual,
        datosCargados,
        errorCarga,
        socioActualId,
        setSocioActualId,
        cantidadInscriptos,
        cupoDisponible,
        actividadesDeSocio,
        guardarSocio,
        registrarSocio,
        guardarActividad,
        eliminarActividad,
        inscribirSocio,
        darDeBaja,
        reiniciarDemo,
      }}
    >
      {children}
    </ContextoClub.Provider>
  );
}

export function usarClub() {
  const contexto = useContext(ContextoClub);
  if (!contexto)
    throw new Error("usarClub debe utilizarse dentro de ProveedorClub.");
  return contexto;
}
