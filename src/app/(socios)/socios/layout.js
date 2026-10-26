import Encabezado from "@/componentes/Encabezado/Encabezado";
import Pie from "@/componentes/Pie/Pie";
export default function DisposicionSocios({ children }) {
  return (
    <>
      <Encabezado sector="socios" />
      <main id="contenido-principal">{children}</main>
      <Pie compacto />
    </>
  );
}
