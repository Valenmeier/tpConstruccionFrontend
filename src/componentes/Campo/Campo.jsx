export default function Campo({
  nombre,
  etiqueta,
  valor,
  alCambiar,
  tipo = "text",
  error,
  opciones,
  ...resto
}) {
  return (
    <div className="campo">
      <label htmlFor={nombre}>{etiqueta}</label>
      {opciones ? (
        <select
          id={nombre}
          name={nombre}
          value={valor}
          onChange={alCambiar}
          {...resto}
        >
          {opciones.map(([id, texto]) => (
            <option key={id} value={id}>
              {texto}
            </option>
          ))}
        </select>
      ) : tipo === "textarea" ? (
        <textarea
          id={nombre}
          name={nombre}
          value={valor}
          onChange={alCambiar}
          {...resto}
        />
      ) : (
        <input
          id={nombre}
          name={nombre}
          type={tipo}
          value={valor}
          onChange={alCambiar}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${nombre}-error` : undefined}
          {...resto}
        />
      )}
      {error && (
        <small id={`${nombre}-error`} className="error-campo" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
