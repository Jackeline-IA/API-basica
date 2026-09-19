import { useEffect, useState } from 'react';
import { listar, eliminar } from '../api/estudiantes';
import { EstudianteForm } from './EstudianteForm';
import { EstudianteItem } from './EstudianteItem';

export function EstudianteLista() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [estudianteEditar, setEstudianteEditar] = useState(null);

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((respuesta) => setDatos(respuesta.results))
      .catch(() => setError('No se pudo cargar la lista de estudiantes.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevo = () => {
    setEstudianteEditar(null);
    setMostrarForm(true);
  };

  const handleEditar = (estudiante) => {
    setEstudianteEditar(estudiante);
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este estudiante?')) return;
    await eliminar(id);
    cargarDatos();
  };

  const handleGuardado = () => {
    setMostrarForm(false);
    cargarDatos();
  };

  if (mostrarForm) {
    return (
      <EstudianteForm
        estudianteEditar={estudianteEditar}
        onGuardado={handleGuardado}
        onCancelar={() => setMostrarForm(false)}
      />
    );
  }

  if (cargando) return <p>Cargando…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <button onClick={handleNuevo}>+ Nuevo estudiante</button>
      {datos.length === 0 ? (
        <p>Todavía no hay estudiantes registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((e) => (
              <EstudianteItem
                key={e.id}
                estudiante={e}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}