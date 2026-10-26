import Encabezado from "@/componentes/Encabezado/Encabezado";
import Pie from "@/componentes/Pie/Pie";
export default function DisposicionPublica({ children }) {
  return (
    <>
      <Encabezado sector="publico" />
      <main id="contenido-principal">{children}</main>
      <Pie />
    </>
  );
}
