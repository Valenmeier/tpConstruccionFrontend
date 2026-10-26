const trazos = {
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  cerrar: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  flecha: (
    <>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </>
  ),
  volver: (
    <>
      <path d="M19 12H5m6-6-6 6 6 6" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  usuarios: (
    <>
      <path d="M16 20a6 6 0 0 0-12 0M18 4a4 4 0 0 1 0 8M20 20h2a6 6 0 0 0-4-5.7" />
      <circle cx="10" cy="8" r="4" />
    </>
  ),
  ubicacion: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  actividad: (
    <>
      <path d="m4 16 4-5 4 3 4-7 4 4" />
      <path d="M3 20h18" />
    </>
  ),
  tablero: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  lista: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  mas: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </>
  ),
  editar: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4" />
    </>
  ),
  eliminar: (
    <>
      <path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6M14 11v6" />
    </>
  ),
  salir: (
    <>
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 16l4-4-4-4M8 12h10" />
    </>
  ),
  corazon: (
    <>
      <path d="M20.8 8.5c0 5-8.8 11.4-8.8 11.4S3.2 13.5 3.2 8.5a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z" />
    </>
  ),
  moneda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.5c-1-1-5-1.5-6 1-1.4 3.5 6 2 6 5 0 3-5 3.5-7 1.5M12 5v14" />
    </>
  ),
  futbol: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7-5 4 2 6h6l2-6-5-4ZM12 7V3M7 11 3 9M17 11l4-2M9 17l-2 4M15 17l2 4" />
    </>
  ),
  voley: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-1 5 1 9 6 11M5 5c5 0 8 4 8 8M3 13c5-2 9-1 13 6M9 21c0-5 3-8 9-10" />
    </>
  ),
  basquet: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M6 5c5 3 5 11 0 14M18 5c-5 3-5 11 0 14" />
    </>
  ),
  natacion: (
    <>
      <path d="M2 16c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 8 0M2 21c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 8 0M9 10l4-3 4 3M13 7l3-3" />
      <circle cx="18" cy="5" r="2" />
    </>
  ),
  patin: (
    <>
      <path d="M4 4h9l3 9 4 2v3H3v-3l3-3V4Zm-1 16h18" />
      <circle cx="7" cy="21" r="1" />
      <circle cx="16" cy="21" r="1" />
    </>
  ),
  ajedrez: (
    <>
      <path d="M8 20h9M9 17h7l1-3-4-4 2-4-5-3-2 4 4 3-4 4 1 3Z" />
    </>
  ),
  fitness: (
    <>
      <path d="M2 9v6m3-9v12m3-9v6m8-6v6m3-9v12m3-9v6M8 12h8" />
    </>
  ),
  yoga: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="m12 9-3 4-4 2-2 5m9-11 3 4 4 2 2 5M6 21l6-4 6 4M9 14h6" />
    </>
  ),
};
export default function Icono({ nombre, tamano = 20, ...resto }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...resto}
    >
      {trazos[nombre] || trazos.actividad}
    </svg>
  );
}
