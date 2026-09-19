export function EstudianteItem({ estudiante, onEditar, onEliminar }) {
  return (
    <tr>
      <td>{estudiante.nombre}</td>
      <td>{estudiante.documento}</td>
      <td>{estudiante.email}</td>
      <td>
        <button onClick={() => onEditar(estudiante)}>Editar</button>
        <button onClick={() => onEliminar(estudiante.id)}>Eliminar</button>
      </td>
    </tr>
  );
}