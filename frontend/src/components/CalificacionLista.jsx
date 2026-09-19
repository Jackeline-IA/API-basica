import { useEffect, useState } from 'react';
import { listar, eliminar } from '../api/calificaciones';
import { CalificacionForm } from './CalificacionForm';
import { CalificacionItem } from './CalificacionItem';

export function CalificacionLista() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [calificacionEditar, setCalificacionEditar] = useState(null);

  const cargarDatos = () => {
    setCargando(true);
    listar()
      .then((respuesta) => setDatos(respuesta.results))
      .catch(() => setError('No se pudo cargar la lista de calificaciones.'))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevo = () => {
    setCalificacionEditar(null);
    setMostrarForm(true);
  };

  const handleEditar = (calificacion) => {
    setCalificacionEditar(calificacion);
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta calificación?')) return;
    await eliminar(id);
    cargarDatos();
  };

  const handleGuardado = () => {
    setMostrarForm(false);
    cargarDatos();
  };

  if (mostrarForm) {
    return (
      <CalificacionForm
        calificacionEditar={calificacionEditar}
        onGuardado={handleGuardado}
        onCancelar={() => setMostrarForm(false)}
      />
    );
  }

  if (cargando) return <p>Cargando…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <button onClick={handleNuevo}>+ Nueva calificación</button>
      {datos.length === 0 ? (
        <p>Todavía no hay calificaciones registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Evaluación</th>
              <th>Nota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((c) => (
              <CalificacionItem
                key={c.id}
                calificacion={c}
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