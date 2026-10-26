import mysql from "mysql2/promise";
// Único lugar que conoce la base; nunca importar desde un Client Component.
let pool;
export function obtenerBaseDatos() {
  if (!process.env.DATABASE_URL)
    throw new Error("Falta DATABASE_URL en .env.local.");
  if (!pool)
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 5,
      decimalNumbers: true,
      dateStrings: true,
    });
  return pool;
}
