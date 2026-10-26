import "./normalize.css";
import "./globals.css";
import { ProveedorClub } from "@/contextos/ContextoClub";
import AvisoConexion from "@/componentes/AvisoConexion/AvisoConexion";

export const metadata = {
  title: {
    default: "Club Los Algarrobos",
    template: "%s | Club Los Algarrobos",
  },
  description:
    "Club Los Algarrobos: actividades, comunidad y deporte en Córdoba.",
};

export default function DisposicionRaiz({ children }) {
  return (
    <html lang="es">
      <body>
        <ProveedorClub>
          <AvisoConexion />
          {children}
        </ProveedorClub>
      </body>
    </html>
  );
}
