// =========================================================
// Sitio público - Club Los Algarrobos
// Un solo archivo para las tres páginas. Al final se fija en qué página estamos
// y ejecuta solo lo que corresponde.
// =========================================================

// ---------- 1. Clase Actividad ----------

class Actividad {
  constructor(datos) {
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.disciplina = datos.disciplina;
    this.dias = datos.dias;
    this.horario = datos.horario;
    this.edadMinima = datos.edadMinima;
    this.edadMaxima = datos.edadMaxima;
    this.cupo = datos.cupo;
    this.cuota = datos.cuota;
    this.profesor = datos.profesor;
  }

  // Devuelve true si una persona de esa edad puede anotarse en la actividad.
  esAptaParaEdad(edad) {
    return edad >= this.edadMinima && edad <= this.edadMaxima;
  }

  // Devuelve la cuota con formato argentino. Ej: 18000 -> "$ 18.000"
  cuotaConFormato() {
    return "$ " + this.cuota.toLocaleString("es-AR");
  }
}

// ---------- 2. Arreglo de actividades (datos de la sección 3.3 del enunciado) ----------

const actividades = [
  new Actividad({
    id: 1,
    nombre: "Fútbol infantil",
    disciplina: "Fútbol",
    dias: "Lunes y miércoles",
    horario: "18:00",
    edadMinima: 6,
    edadMaxima: 12,
    cupo: 40,
    cuota: 18000,
    profesor: "Diego Ferreyra",
  }),
  new Actividad({
    id: 2,
    nombre: "Vóley mixto",
    disciplina: "Vóley",
    dias: "Martes y jueves",
    horario: "19:00",
    edadMinima: 13,
    edadMaxima: 60,
    cupo: 24,
    cuota: 20000,
    profesor: "Laura Ceballos",
  }),
  new Actividad({
    id: 3,
    nombre: "Básquet juvenil",
    disciplina: "Básquet",
    dias: "Lunes y viernes",
    horario: "19:30",
    edadMinima: 12,
    edadMaxima: 17,
    cupo: 20,
    cuota: 19000,
    profesor: "Martín Oviedo",
  }),
  new Actividad({
    id: 4,
    nombre: "Natación",
    disciplina: "Natación",
    dias: "Martes y jueves",
    horario: "17:00",
    edadMinima: 5,
    edadMaxima: 70,
    cupo: 30,
    cuota: 26000,
    profesor: "Sofía Bustos",
  }),
  new Actividad({
    id: 5,
    nombre: "Patín artístico",
    disciplina: "Patín",
    dias: "Miércoles y viernes",
    horario: "17:30",
    edadMinima: 5,
    edadMaxima: 15,
    cupo: 25,
    cuota: 21000,
    profesor: "Carla Peralta",
  }),
  new Actividad({
    id: 6,
    nombre: "Ajedrez",
    disciplina: "Ajedrez",
    dias: "Sábados",
    horario: "10:00",
    edadMinima: 8,
    edadMaxima: 99,
    cupo: 16,
    cuota: 9000,
    profesor: "Raúl Giménez",
  }),
  new Actividad({
    id: 7,
    nombre: "Funcional adultos",
    disciplina: "Fitness",
    dias: "Lunes, miércoles y viernes",
    horario: "20:30",
    edadMinima: 18,
    edadMaxima: 65,
    cupo: 30,
    cuota: 22000,
    profesor: "Paula Luna",
  }),
  new Actividad({
    id: 8,
    nombre: "Yoga",
    disciplina: "Bienestar",
    dias: "Martes y jueves",
    horario: "9:00",
    edadMinima: 16,
    edadMaxima: 99,
    cupo: 15,
    cuota: 17000,
    profesor: "Inés Arguello",
  }),
];

function buscarActividadPorId(id) {
  for (const actividad of actividades) {
    if (actividad.id === id) {
      return actividad;
    }
  }
  return null;
}

// ---------- 3. Página de actividades: catálogo y filtros ----------

function iniciarCatalogo() {
  // Buscamos los elementos del DOM por su id
  const selectDisciplina = document.getElementById("filtro-disciplina");
  const inputEdad = document.getElementById("filtro-edad");
  const botonLimpiar = document.getElementById("limpiar-filtros");

  cargarOpcionesDeDisciplina(selectDisciplina);
  mostrarActividades(actividades);

  // Cada vez que el usuario cambia un filtro, se vuelve a dibujar la lista
  selectDisciplina.addEventListener("change", aplicarFiltros);
  inputEdad.addEventListener("input", aplicarFiltros);

  botonLimpiar.addEventListener("click", function () {
    selectDisciplina.value = "";
    inputEdad.value = "";
    aplicarFiltros();
  });
}

// Agrega al <select> una opción por cada disciplina (sin repetir)
function cargarOpcionesDeDisciplina(select) {
  const disciplinas = [];
  for (const actividad of actividades) {
    if (!disciplinas.includes(actividad.disciplina)) {
      disciplinas.push(actividad.disciplina);
    }
  }

  for (const disciplina of disciplinas) {
    const opcion = document.createElement("option");
    opcion.value = disciplina;
    opcion.textContent = disciplina;
    select.appendChild(opcion);
  }
}

function aplicarFiltros() {
  const disciplinaElegida = document.getElementById("filtro-disciplina").value;
  const edadEscrita = document.getElementById("filtro-edad").value;

  const filtradas = [];
  for (const actividad of actividades) {
    const coincideDisciplina =
      disciplinaElegida === "" || actividad.disciplina === disciplinaElegida;
    const coincideEdad =
      edadEscrita === "" || actividad.esAptaParaEdad(Number(edadEscrita));

    if (coincideDisciplina && coincideEdad) {
      filtradas.push(actividad);
    }
  }

  mostrarActividades(filtradas);
}

// Borra las tarjetas que había y crea una tarjeta nueva por cada actividad de la lista
function mostrarActividades(lista) {
  const contenedor = document.getElementById("lista-actividades");
  const resultado = document.getElementById("resultado-filtros");

  contenedor.innerHTML = "";

  for (const actividad of lista) {
    contenedor.appendChild(crearTarjeta(actividad));
  }

  if (lista.length === 0) {
    resultado.textContent =
      "No hay actividades para esa edad y disciplina. Probá con otra combinación o limpiá los filtros.";
  } else if (lista.length === 1) {
    resultado.textContent = "Hay 1 actividad para vos.";
  } else {
    resultado.textContent = "Hay " + lista.length + " actividades para vos.";
  }
}

function crearTarjeta(actividad) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta";
  tarjeta.innerHTML = `
        <h3>${actividad.nombre}</h3>
        <p class="tarjeta-disciplina">${actividad.disciplina}</p>
        <p class="tarjeta-horario">${actividad.horario} h</p>
        <p class="tarjeta-dias">${actividad.dias}</p>
        <ul class="tarjeta-datos">
            <li>De ${actividad.edadMinima} a ${actividad.edadMaxima} años</li>
            <li>Profesor/a: ${actividad.profesor}</li>
            <li>Cupo: ${actividad.cupo} personas</li>
        </ul>
        <p class="tarjeta-cuota">${actividad.cuotaConFormato()} por mes</p>
        <a class="boton" href="preinscripcion.html?actividad=${actividad.id}">Preinscribirme</a>
    `;
  return tarjeta;
}

// ---------- 4. Página de preinscripción: formulario y validación ----------

function iniciarPreinscripcion() {
  const formulario = document.getElementById("formulario-preinscripcion");
  const selectActividad = document.getElementById("actividad");
  const botonVolver = document.getElementById("boton-volver");

  // Opciones del <select> generadas desde el mismo arreglo de actividades
  for (const actividad of actividades) {
    const opcion = document.createElement("option");
    opcion.value = actividad.id;
    opcion.textContent =
      actividad.nombre +
      " (" +
      actividad.edadMinima +
      " a " +
      actividad.edadMaxima +
      " años)";
    selectActividad.appendChild(opcion);
  }

  // Objeto location: si se llegó desde una tarjeta (preinscripcion.html?actividad=3),
  // leemos ese número de la URL y dejamos la actividad ya elegida.
  const parametros = new URLSearchParams(window.location.search);
  const actividadDeLaUrl = parametros.get("actividad");
  if (actividadDeLaUrl !== null) {
    selectActividad.value = actividadDeLaUrl;
  }

  // Objeto history: el botón "Volver" lleva a la página anterior.
  // Si se abrió la página directamente (no hay página anterior), va al inicio.
  botonVolver.addEventListener("click", function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita que el navegador recargue la página

    if (validarFormulario()) {
      mostrarMensajeExito();
      formulario.reset();
    }
  });
}

// RN7: el DNI debe tener 7 u 8 dígitos, solo números (sin puntos)
function esDniValido(dni) {
  return /^[0-9]{7,8}$/.test(dni);
}

// Formato básico de correo: algo@algo.algo
function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function calcularEdad(fechaTexto) {
  const hoy = new Date();
  const nacimiento = new Date(fechaTexto + "T00:00:00");
  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  // Si todavía no cumplió años este año, le restamos uno
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad = edad - 1;
  }
  return edad;
}

function validarFormulario() {
  limpiarErrores();
  let esValido = true;

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
  const email = document.getElementById("email").value.trim();
  const idActividad = document.getElementById("actividad").value;

  if (nombre === "") {
    mostrarError("nombre", "Escribí tu nombre.");
    esValido = false;
  }

  if (apellido === "") {
    mostrarError("apellido", "Escribí tu apellido.");
    esValido = false;
  }

  if (dni === "") {
    mostrarError("dni", "Escribí tu DNI.");
    esValido = false;
  } else if (!esDniValido(dni)) {
    mostrarError(
      "dni",
      "El DNI debe tener 7 u 8 números, sin puntos ni letras.",
    );
    esValido = false;
  }

  if (fechaNacimiento === "") {
    mostrarError("fecha-nacimiento", "Ingresá tu fecha de nacimiento.");
    esValido = false;
  } else if (calcularEdad(fechaNacimiento) < 0) {
    mostrarError(
      "fecha-nacimiento",
      "La fecha de nacimiento no puede ser futura.",
    );
    esValido = false;
  }

  if (email === "") {
    mostrarError("email", "Escribí tu correo electrónico.");
    esValido = false;
  } else if (!esEmailValido(email)) {
    mostrarError(
      "email",
      "Revisá el correo: tiene que ser como nombre@correo.com.",
    );
    esValido = false;
  }

  if (idActividad === "") {
    mostrarError("actividad", "Elegí una actividad.");
    esValido = false;
  } else if (fechaNacimiento !== "" && calcularEdad(fechaNacimiento) >= 0) {
    // Usamos el método de la clase para avisar si la edad no corresponde
    const actividad = buscarActividadPorId(Number(idActividad));
    const edad = calcularEdad(fechaNacimiento);
    if (!actividad.esAptaParaEdad(edad)) {
      mostrarError(
        "actividad",
        actividad.nombre +
          " es de " +
          actividad.edadMinima +
          " a " +
          actividad.edadMaxima +
          " años y tenés " +
          edad +
          ". Elegí otra actividad.",
      );
      esValido = false;
    }
  }

  return esValido;
}

// Muestra el mensaje debajo del campo y lo marca como inválido (el CSS lo pinta de rojo)
function mostrarError(idCampo, mensaje) {
  document.getElementById(idCampo).setAttribute("aria-invalid", "true");
  document.getElementById("error-" + idCampo).textContent = mensaje;
}

function limpiarErrores() {
  const campos = [
    "nombre",
    "apellido",
    "dni",
    "fecha-nacimiento",
    "email",
    "telefono",
    "actividad",
  ];
  for (const idCampo of campos) {
    document.getElementById(idCampo).removeAttribute("aria-invalid");
    document.getElementById("error-" + idCampo).textContent = "";
  }
}

function mostrarMensajeExito() {
  const nombre = document.getElementById("nombre").value.trim();
  const actividad = buscarActividadPorId(
    Number(document.getElementById("actividad").value),
  );
  const mensaje = document.getElementById("mensaje-exito");

  mensaje.textContent =
    "¡Listo, " +
    nombre +
    "! Recibimos tu preinscripción a " +
    actividad.nombre +
    ". La secretaría te va a llamar en los próximos días.";
  mensaje.hidden = false;
  mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ---------- 5. Arranque: ejecutamos solo lo que corresponde a cada página ----------

if (document.getElementById("lista-actividades")) {
  iniciarCatalogo();
}

if (document.getElementById("formulario-preinscripcion")) {
  iniciarPreinscripcion();
}
