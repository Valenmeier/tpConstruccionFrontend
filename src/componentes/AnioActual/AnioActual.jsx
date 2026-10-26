"use client";

import { useEffect, useState } from "react";

export default function AnioActual() {
  const [anio, setAnio] = useState(null);

  useEffect(() => {
    setAnio(new Date().getFullYear());
  }, []);

  return anio;
}
