import FormularioRegistro from "@/componentes/FormularioRegistro/FormularioRegistro";
import Icono from "@/componentes/Icono/Icono";
import estilos from "./page.module.css";
export const metadata = { title: "Asociate" };
export default function Preinscripcion() {
  return (
    <div className="contenedor pagina">
      <div className={estilos.contenido}>
        <aside className={estilos.introduccion}>
          <span className="sobretitulo">FORMÁ PARTE</span>
          <h1 className="titulo-pagina">
            Primero nos conocemos. Después, ¡a jugar!
          </h1>
          <p>
            Asociate al Club Los Algarrobos para acceder a las actividades y
            anotarte según tu edad y los cupos disponibles.
          </p>
          <div className={estilos.pasos}>
            <div>
              <span>01</span>
              <p>
                <strong>Completá tus datos</strong>
                <small>Solicitá tu alta como socio del club.</small>
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                <strong>Ingresá a Mi Club</strong>
                <small>Accedé a tu espacio personal.</small>
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                <strong>Elegí tus actividades</strong>
                <small>Inscribite en lo que más te guste.</small>
              </p>
            </div>
          </div>
          <div className={estilos.nota}>
            <Icono nombre="escudo" tamano={20} />
            <p>
              Este formulario representa el alta de socio en la demo. Cuando
              integremos el backend, se completará el proceso seguro de
              registro.
            </p>
          </div>
        </aside>
        <section
          className={`panel ${estilos.panel}`}
          aria-labelledby="titulo-formulario"
        >
          <div className={estilos.panelSuperior}>
            <span className="etiqueta">ALTA DE SOCIO</span>
            <h2 id="titulo-formulario">Creá tu cuenta</h2>
            <p>Todos los campos con * son obligatorios.</p>
          </div>
          <FormularioRegistro />
        </section>
      </div>
    </div>
  );
}
