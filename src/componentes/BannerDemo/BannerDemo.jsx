import estilos from "./BannerDemo.module.css";
export default function BannerDemo({ children }) {
  return (
    <aside className={estilos.banner} aria-label="Aviso del prototipo">
      <strong>Modo demostración</strong>
      <span>
        {children ||
          "Datos ficticios para prácticas. Con NEXT_PUBLIC_USAR_API=true los cambios se guardan en MySQL. Aún no hay autenticación real."}
      </span>
    </aside>
  );
}
