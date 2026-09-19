export function CalificacionItem({ calificacion, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{calificacion.estudiante_nombre}</td>
      <td>{calificacion.evaluacion_nombre}</td>
      <td>{calificacion.nota}</td>
      <td>
        <button onClick={() => onEditar(calificacion)}>Editar</button>
        <button onClick={() => onEliminar(calificacion.id)}>Eliminar</button>
      </td>
    </tr>
  );
}